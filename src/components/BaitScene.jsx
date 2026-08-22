import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const KEYFRAMES = [
  { at: 0.00, x: 0, y: -0.3, z: 3.5, rotX: THREE.MathUtils.degToRad(0),   rotY: THREE.MathUtils.degToRad(-90) },
  { at: 0.50, x: 0, y: -0.7, z: 3.5, rotX: THREE.MathUtils.degToRad(-10), rotY: THREE.MathUtils.degToRad(40) },
  { at: 1,    x: 0, y: -0.9, z: 3.5, rotX: THREE.MathUtils.degToRad(-15), rotY: THREE.MathUtils.degToRad(-40) },
];

// ── ASPECT-RATIO-AWARE FRAMING ───────────────────────────────────
function getResponsiveSettings(width, height) {
  const aspect = width / height;

  const baseFov = 45;
  const baseDistance = 8;
  const baseScale = 1;

  const referenceAspect = 1.6;

  // Raise this floor if the model still looks too small on narrow phones.
  // 0.35 = can shrink to 35% of base size. Try 0.5–0.65 if it's too small.
  const narrownessFloor = .8;

  // Direct manual multiplier applied ONLY on top of whatever the aspect
  // math produces — your main "make mobile bigger/smaller" dial.
  const mobileScaleBoost = 1.3;

  let distance = baseDistance;
  let scale = baseScale;

  if (aspect < referenceAspect) {
    const narrowness = Math.max(aspect / referenceAspect, narrownessFloor);

    distance = baseDistance / narrowness;
    scale = baseScale * narrowness * mobileScaleBoost;
  }

  const dpr = width < 768 ? [1, 1.5] : [1, 2];

  return {
    camera: { position: [0, 0, distance], fov: baseFov },
    scale,
    dpr,
  };
}
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function Model({ containerRef, scale }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/models/razor-bait-optimized.glb");

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("yonah:3d-ready"));
  }, []);

  useFrame(() => {
    if (!group.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / total, 0), 1);

    let i = 0;
    while (i < KEYFRAMES.length - 2 && progress >= KEYFRAMES[i + 1].at) {
      i++;
    }

    const from = KEYFRAMES[i];
    const to = KEYFRAMES[i + 1];
    const span = to.at - from.at;
    const localT = span > 0 ? (progress - from.at) / span : 1;
    const t = smoothstep(Math.min(Math.max(localT, 0), 1));

    group.current.position.x = lerp(from.x, to.x, t);
    group.current.position.y = lerp(from.y, to.y, t);
    group.current.position.z = lerp(from.z, to.z, t);
    group.current.rotation.x = lerp(from.rotX, to.rotX, t);
    group.current.rotation.y = lerp(from.rotY, to.rotY, t);
  });

  return (
    <group ref={group} scale={scale}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.model.geometry}
        material={materials.model}
      />
    </group>
  );
}

useGLTF.preload("/models/razor-bait-optimized.glb");

export default function Scene() {
  const containerRef = useRef(null);
  const [settings, setSettings] = useState(() =>
    getResponsiveSettings(
      typeof window !== "undefined" ? window.innerWidth : 1280,
      typeof window !== "undefined" ? window.innerHeight : 800
    )
  );

  useEffect(() => {
    containerRef.current = document.querySelector("#three-scroll");

    const onResize = () => {
      setSettings(getResponsiveSettings(window.innerWidth, window.innerHeight));
    };

    // Run once on mount too — fixes any mismatch from SSR/hydration
    // where the initial state may have been computed before real
    // window dimensions were available.
    onResize();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return (
    <div className="pointer-events-none sticky top-0 z-10 h-screen w-full float-slow">
      <Canvas camera={settings.camera} dpr={settings.dpr}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={3} />
        <pointLight position={[-3, 4, 10]} intensity={2} />
        <Environment preset="city" />
        <Model containerRef={containerRef} scale={settings.scale} />
      </Canvas>
    </div>
  );
}