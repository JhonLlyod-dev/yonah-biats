import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/razor-bait-optimized.glb";

const KEYFRAMES = [
  {
    at: 0.0,
    x: 0,
    y: -0.3,
    z: 3.5,
    rotX: THREE.MathUtils.degToRad(0),
    rotY: THREE.MathUtils.degToRad(-90),
  },
  {
    at: 0.5,
    x: 0,
    y: -0.7,
    z: 3.5,
    rotX: THREE.MathUtils.degToRad(-10),
    rotY: THREE.MathUtils.degToRad(40),
  },
  {
    at: 1,
    x: 0,
    y: -0.9,
    z: 3.5,
    rotX: THREE.MathUtils.degToRad(-15),
    rotY: THREE.MathUtils.degToRad(-40),
  },
];

// ─────────────────────────────────────────────────────────────
// RESPONSIVE SETTINGS
// ─────────────────────────────────────────────────────────────

function getResponsiveSettings(width, height) {
  const aspect = width / height;

  const baseFov = 45;
  const baseDistance = 8;
  const baseScale = 1;

  const referenceAspect = 1.6;

  const narrownessFloor = 0.8;

  // Main mobile size adjustment
  const mobileScaleBoost = 1.3;

  let distance = baseDistance;
  let scale = baseScale;

  if (aspect < referenceAspect) {
    const narrowness = Math.max(
      aspect / referenceAspect,
      narrownessFloor
    );

    distance = baseDistance / narrowness;
    scale = baseScale * narrowness * mobileScaleBoost;
  }

  // Mobile gets DPR 1 for better GPU performance.
  // Desktop can use a little more resolution.
  const dpr = width < 768 ? 1 : [1, 1.5];

  return {
    camera: {
      position: [0, 0, distance],
      fov: baseFov,
    },
    scale,
    dpr,
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

// ─────────────────────────────────────────────────────────────
// MODEL
// ─────────────────────────────────────────────────────────────

function Model({ containerRef, scale, scrollProgress }) {
  const group = useRef();

  const { nodes, materials } = useGLTF(MODEL_PATH);

  // Tell the rest of the site that the 3D model is ready.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("yonah:3d-ready"));
  }, []);

  useFrame(() => {
    if (!group.current) return;

    const progress = scrollProgress.current;

    let i = 0;

    while (
      i < KEYFRAMES.length - 2 &&
      progress >= KEYFRAMES[i + 1].at
    ) {
      i++;
    }

    const from = KEYFRAMES[i];
    const to = KEYFRAMES[i + 1];

    const span = to.at - from.at;

    const localT =
      span > 0
        ? (progress - from.at) / span
        : 1;

    const t = smoothstep(
      Math.min(Math.max(localT, 0), 1)
    );

    group.current.position.x = lerp(
      from.x,
      to.x,
      t
    );

    group.current.position.y = lerp(
      from.y,
      to.y,
      t
    );

    group.current.position.z = lerp(
      from.z,
      to.z,
      t
    );

    group.current.rotation.x = lerp(
      from.rotX,
      to.rotX,
      t
    );

    group.current.rotation.y = lerp(
      from.rotY,
      to.rotY,
      t
    );
  });

  return (
    <group
      ref={group}
      scale={scale}
    >
      <mesh
        geometry={nodes.model.geometry}
        material={materials.model}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE
// ─────────────────────────────────────────────────────────────

export default function Scene() {
  const containerRef = useRef(null);

  // Stores scroll progress without causing React re-renders.
  const scrollProgress = useRef(0);

  const [settings, setSettings] = useState(() =>
    getResponsiveSettings(
      typeof window !== "undefined"
        ? window.innerWidth
        : 1280,
      typeof window !== "undefined"
        ? window.innerHeight
        : 800
    )
  );

  // ───────────────────────────────────────────────────────────
  // FIND SCROLL CONTAINER
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    containerRef.current =
      document.querySelector("#three-scroll");
  }, []);

  // ───────────────────────────────────────────────────────────
  // SCROLL PROGRESS
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    const updateScrollProgress = () => {
      const container = containerRef.current;

      if (!container) return;

      const rect = container.getBoundingClientRect();

      const total =
        rect.height - window.innerHeight;

      if (total <= 0) {
        scrollProgress.current = 0;
        return;
      }

      const scrolled = -rect.top;

      scrollProgress.current = Math.min(
        Math.max(scrolled / total, 0),
        1
      );
    };

    // Calculate immediately.
    updateScrollProgress();

    // Passive = browser doesn't need to wait for JS
    // before continuing the scroll.
    window.addEventListener(
      "scroll",
      updateScrollProgress,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateScrollProgress
      );
    };
  }, []);

  // ───────────────────────────────────────────────────────────
  // RESIZE / ORIENTATION
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    const onResize = () => {
      setSettings(
        getResponsiveSettings(
          window.innerWidth,
          window.innerHeight
        )
      );
    };

    onResize();

    window.addEventListener(
      "resize",
      onResize
    );

    window.addEventListener(
      "orientationchange",
      onResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        onResize
      );

      window.removeEventListener(
        "orientationchange",
        onResize
      );
    };
  }, []);

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────

  return (
    <div className="pointer-events-none sticky top-0 z-10 h-screen w-full float-slow">
      <Canvas
        camera={settings.camera}
        dpr={settings.dpr}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        {/* Lightweight lighting setup */}
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={3}
        />

        <pointLight
          position={[-3, 4, 10]}
          intensity={2}
        />

        <Model
          containerRef={containerRef}
          scale={settings.scale}
          scrollProgress={scrollProgress}
        />
      </Canvas>
    </div>
  );
}