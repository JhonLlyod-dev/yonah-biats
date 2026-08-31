import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const MODEL_PATH = '/models/yonah.glb'; // ⚠️ update this path if your compressed file lives elsewhere
const MODEL_SCALE_MULTIPLIER = 0.029;

const KEYFRAMES = [
  {
    at: 0,
    x: 0.2,
    y: 0.2,
    z: 3.5,
    rotX: THREE.MathUtils.degToRad(0),
    rotY: THREE.MathUtils.degToRad(-90),
  },
  {
    at: 0.5,
    x: -0.1,
    y: -0.3,
    z: 3.5,
    rotX: THREE.MathUtils.degToRad(-10),
    rotY: THREE.MathUtils.degToRad(140),
  },
  {
    at: 1,
    x: 0,
    y: 0,
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
        position={[-0.325, -11.015, -5.283]}
        rotation={[-2.297, 0.105, -0.42]}
        scale={[-234.327, 234.327, 234.328]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["0001"].geometry}
          material={materials["Hook.001"]}
          position={[0, 0.004, -0.018]}
          scale={0.02}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes["0001_1"].geometry}
          material={materials["Pewterish.001"]}
          position={[0, 0, -0.018]}
          scale={0.01}
        />
      </group>

      <group
        position={[-0.054, -1.477, 30.302]}
        rotation={[-2.175, -0.015, 0.058]}
        scale={[-233.327, 233.327, 233.327]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["0003"].geometry}
          material={materials["Hook.001"]}
          position={[0, 0.004, -0.018]}
          scale={0.02}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes["0003_1"].geometry}
          material={materials["Pewterish.001"]}
          position={[0, 0, -0.018]}
          scale={0.01}
        />
      </group>

      <group position={[-0.075, 0.604, 0.37]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001.geometry}
          material={materials["Material.007"]}
          position={[0.023, 1.543, -0.435]}
          scale={13.898}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_1.geometry}
          material={materials["Material.008"]}
          position={[0.025, 4.518, -10.041]}
          scale={5.881}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_2.geometry}
          material={materials["Material.009"]}
          position={[-0.118, -2.632, -21.19]}
          scale={8.227}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_3.geometry}
          material={materials["Material.010"]}
          position={[0.026, -0.56, 4.934]}
          scale={25.048}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_4.geometry}
          material={materials["Material.011"]}
          position={[0.026, 6.901, 3.657]}
          scale={23.981}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_5.geometry}
          material={materials["Material.012"]}
          position={[-0.019, -5.691, 4.947]}
          scale={26.699}
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

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 767px)"
    );

    const updateMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateMobile();

    mediaQuery.addEventListener("change", updateMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    containerRef.current = document.querySelector("#three-scroll");
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const updateScrollProgress = () => {
      const container = containerRef.current;

      if (!container) return;

      const rect = container.getBoundingClientRect();

      const total = rect.height - window.innerHeight;

      if (total <= 0) {
        scrollProgress.current = 0;
        return;
      }

      const progress = -rect.top / total;

      scrollProgress.current = Math.min(Math.max(progress, 0), 1);
    };

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const updateSettings = () => {
      setSettings(
        getResponsiveSettings(window.innerWidth, window.innerHeight)
      );
    };

    updateSettings();

    window.addEventListener("resize", updateSettings);

    return () => {
      window.removeEventListener("resize", updateSettings);
    };
  }, [isMobile]);

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
        <ambientLight intensity={1} color="#ffffff" />

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

        <Model scale={settings.scale} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}