// BaitScene.jsx
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Center } from "@react-three/drei";

// Separate keyframe sets per breakpoint — tune each independently
// since mobile's narrower/taller viewport needs different swing distances.
const KEYFRAMES_DESKTOP = [
  { x: 0, y: 0, z: 0, rotY: 0 },
  { x: -1.2, y: -0.1, z: 1.8, rotY: 0.7 },
  { x: -1.2, y: 0, z: -1.8, rotY: -4.2 },
];

const KEYFRAMES_TABLET = [
  { x: 0, y: 0, z: 0, rotY: 0 },
  { x: -0.8, y: -0.1, z: 1.2, rotY: 0.7 },
  { x: -0.8, y: 0, z: -1.2, rotY: -4.2 },
];

const KEYFRAMES_MOBILE = [
  { x: 0, y: 0, z: 0, rotY: 0 },
  { x: -0.4, y: -0.05, z: 0.8, rotY: 0.7 },
  { x: -0.4, y: 0, z: -0.8, rotY: -4.2 },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function Bait({ progressRef, scale, keyframes }) {
  const group = useRef();
  const { scene } = useGLTF("/models/razor-bait-optimized.glb");

  useFrame(() => {
    if (!group.current) return;

    const progress = progressRef.current;
    const segments = keyframes.length - 1;
    const scaled = progress * segments;
    const i = Math.min(Math.floor(scaled), segments - 1);
    const t = smoothstep(scaled - i);

    const from = keyframes[i];
    const to = keyframes[i + 1];

    group.current.position.x = lerp(from.x, to.x, t);
    group.current.position.y = lerp(from.y, to.y, t);
    group.current.position.z = lerp(from.z, to.z, t);
    group.current.rotation.y = lerp(from.rotY, to.rotY, t);
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} scale={scale} />
      </Center>
    </group>
  );
}

function getResponsiveSettings(width) {
  if (width < 480) {
    return {
      camera: { position: [4.5, 0.4, 0], fov: 42 },
      scale: 0.8,
      dpr: [1, 1.5],
      keyframes: KEYFRAMES_MOBILE,
    };
  }
  if (width < 768) {
    return {
      camera: { position: [4.8, 0.35, 0], fov: 38 },
      scale: 0.9,
      dpr: [1, 1.5],
      keyframes: KEYFRAMES_TABLET,
    };
  }
  if (width < 1024) {
    return {
      camera: { position: [5, 0.3, 0], fov: 36 },
      scale: 1,
      dpr: [1, 2],
      keyframes: KEYFRAMES_DESKTOP,
    };
  }
  return {
    camera: { position: [5, 0.3, 0], fov: 35 },
    scale: 1,
    dpr: [1, 2],
    keyframes: KEYFRAMES_DESKTOP,
  };
}

export default function BaitScene() {
  const progressRef = useRef(0);
  const [buried, setBuried] = useState(false);
  const [settings, setSettings] = useState(() =>
    getResponsiveSettings(typeof window !== "undefined" ? window.innerWidth : 1280)
  );

  useEffect(() => {
    const track = document.getElementById("bait-scroll-track");
    if (!track) return;

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(scrolled / total, 0), 1);
      progressRef.current = p;
      setBuried(p >= 1);
    };

    const onResize = () => {
      setSettings(getResponsiveSettings(window.innerWidth));
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none hidden md:block fixed inset-0 z-20 float-slow transition-opacity duration-500 ${
        buried ? "opacity-0" : "opacity-100"
      }`}
    >
      <Canvas camera={settings.camera} dpr={settings.dpr}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 3]} intensity={1.4} />
        <directionalLight position={[-3, -2, -3]} intensity={0.4} />
        <Environment preset="studio" />
        <Suspense fallback={null}>
          <Bait progressRef={progressRef} scale={settings.scale} keyframes={settings.keyframes} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/razor-bait-optimized.glb");