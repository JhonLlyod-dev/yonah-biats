
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/yonah.glb";
const MODEL_SCALE_MULTIPLIER = 0.029;

const KEYFRAMES = [
  {
    at: 0,
    x: 0.2,
    y: -0.3,
    z: 3.5,
    rotX: THREE.MathUtils.degToRad(0),
    rotY: THREE.MathUtils.degToRad(-90),
  },
  {
    at: 0.5,
    x: -0.1,
    y: -1,
    z: 3.5,
    rotX: THREE.MathUtils.degToRad(-10),
    rotY: THREE.MathUtils.degToRad(140),
  },
  {
    at: 1,
    x: 0,
    y: -0.9,
    z: 3.5,
    rotX: THREE.MathUtils.degToRad(-15),
    rotY: THREE.MathUtils.degToRad(-140),
  },
];

function getResponsiveSettings(width, height) {
  const aspect = width / height;

  const baseFov = 45;
  const baseDistance = 8;
  const referenceAspect = 1.6;
  const narrownessFloor = 0.8;
  const mobileScaleBoost = 1.3;

  let distance = baseDistance;
  let scale = 1;

  if (aspect < referenceAspect) {
    const narrowness = Math.max(
      aspect / referenceAspect,
      narrownessFloor
    );

    distance = baseDistance / narrowness;
    scale = narrowness * mobileScaleBoost;
  }

  return {
    camera: {
      position: [0, 0, distance],
      fov: baseFov,
    },
    scale,
    dpr: width < 768 ? 1 : [1, 1.5],
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function Model({ scale, scrollProgress }) {
  const group = useRef(null);
  const { nodes, materials } = useGLTF(MODEL_PATH);

  useFrame(() => {
    if (!group.current) return;

    const progress = scrollProgress.current;

    let index = 0;

    while (
      index < KEYFRAMES.length - 2 &&
      progress >= KEYFRAMES[index + 1].at
    ) {
      index++;
    }

    const from = KEYFRAMES[index];
    const to = KEYFRAMES[index + 1];

    const span = to.at - from.at;

    const localProgress =
      span > 0
        ? (progress - from.at) / span
        : 1;

    const t = smoothstep(
      Math.min(Math.max(localProgress, 0), 1)
    );

    group.current.position.set(
      lerp(from.x, to.x, t),
      lerp(from.y, to.y, t),
      lerp(from.z, to.z, t)
    );

    group.current.rotation.set(
      lerp(from.rotX, to.rotX, t),
      lerp(from.rotY, to.rotY, t),
      0
    );
  });

  return (
    <group
      ref={group}
      scale={scale * MODEL_SCALE_MULTIPLIER}
      dispose={null}
    >
      <group
        position={[-2.533, 11.364, -1.828]}
        rotation={[0.845, -0.105, 0.42]}
        scale={[-234.327, -234.327, -234.328]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["0001"].geometry}
          material={materials["Hook.001"]}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes["0001_1"].geometry}
          material={materials["Pewterish.001"]}
        />
      </group>

      <group
        position={[-2.263, 20.902, 33.757]}
        rotation={[0.967, 0.015, -0.058]}
        scale={-233.327}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["0003"].geometry}
          material={materials["Hook.001"]}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes["0003_1"].geometry}
          material={materials["Pewterish.001"]}
        />
      </group>

      <group position={[-2.283, 22.983, 3.825]}>
        <mesh
          geometry={nodes.Razor_Website001.geometry}
          material={materials["Material.007"]}
        />

        <mesh
          geometry={nodes.Razor_Website001_1.geometry}
          material={materials["Material.008"]}
        />

        <mesh
          geometry={nodes.Razor_Website001_2.geometry}
          material={materials["Material.009"]}
        />

        <mesh
          geometry={nodes.Razor_Website001_3.geometry}
          material={materials["Material.010"]}
        />

        <mesh
          geometry={nodes.Razor_Website001_4.geometry}
          material={materials["Material.011"]}
        />

        <mesh
          geometry={nodes.Razor_Website001_5.geometry}
          material={materials["Material.012"]}
        />
      </group>
    </group>
  );
}

export default function Scene() {
  const containerRef = useRef(null);
  const scrollProgress = useRef(0);

  const [isMobile, setIsMobile] = useState(false);

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

  // Mobile detection
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 767px)"
    );

    const updateMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateMobile();

    mediaQuery.addEventListener(
      "change",
      updateMobile
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateMobile
      );
    };
  }, []);

  // Find scroll container
  useEffect(() => {
    if (isMobile) return;

    containerRef.current =
      document.querySelector("#three-scroll");
  }, [isMobile]);

  // Scroll tracking
  useEffect(() => {
    if (isMobile) return;

    const updateScrollProgress = () => {
      const container = containerRef.current;

      if (!container) return;

      const rect =
        container.getBoundingClientRect();

      const total =
        rect.height - window.innerHeight;

      if (total <= 0) {
        scrollProgress.current = 0;
        return;
      }

      const progress =
        -rect.top / total;

      scrollProgress.current = Math.min(
        Math.max(progress, 0),
        1
      );
    };

    updateScrollProgress();

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
  }, [isMobile]);

  // Resize handling
  useEffect(() => {
    if (isMobile) return;

    const updateSettings = () => {
      setSettings(
        getResponsiveSettings(
          window.innerWidth,
          window.innerHeight
        )
      );
    };

    updateSettings();

    window.addEventListener(
      "resize",
      updateSettings
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateSettings
      );
    };
  }, [isMobile]);

  // Don't render WebGL on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div className="pointer-events-none sticky top-0 z-10 h-screen w-full float-slow">
      <Canvas
        camera={settings.camera}
        dpr={settings.dpr}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight
          intensity={1}
          color="#ffffff"
        />

        <directionalLight
          position={[5, 5, 5]}
          intensity={1.9}
          color="#ffffff"
        />

        <pointLight
          position={[-3, 4, 10]}
          intensity={0.8}
          color="#ffffff"
        />

        <pointLight
          position={[0, -2, -5]}
          intensity={0.8}
          color="#ffffff"
        />

        <Model
          scale={settings.scale}
          scrollProgress={scrollProgress}
        />
      </Canvas>
    </div>
  );
}

