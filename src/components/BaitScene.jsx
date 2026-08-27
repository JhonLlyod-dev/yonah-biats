import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/yonah.glb";

// The new model's baked-in group scales (~234x) are much larger than the
// old model's, so we compensate here. Tune this one number to resize
// everything without touching positions/animation.
const MODEL_SCALE_MULTIPLIER = 0.0290;

const KEYFRAMES = [
  {
    at: 0.0,
    x: .2,
    y: -.3,
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
  const baseScale = 1;

  const referenceAspect = 1.6;
  const narrownessFloor = 0.8;
  const mobileScaleBoost = 1.3;

  let distance = baseDistance;
  let scale = baseScale;

  if (aspect < referenceAspect) {
    const narrowness = Math.max(aspect / referenceAspect, narrownessFloor);
    distance = baseDistance / narrowness;
    scale = baseScale * narrowness * mobileScaleBoost;
  }

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

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function Model({ scale, scrollProgress }) {
  const group = useRef();

  const { nodes, materials } = useGLTF(MODEL_PATH);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("yonah:3d-ready"));
  }, []);

  useFrame(() => {
    if (!group.current) return;

    const progress = scrollProgress.current;

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
    <group ref={group} scale={scale * MODEL_SCALE_MULTIPLIER} dispose={null}>
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
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001.geometry}
          material={materials["Material.007"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_1.geometry}
          material={materials["Material.008"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_2.geometry}
          material={materials["Material.009"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_3.geometry}
          material={materials["Material.010"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Razor_Website001_4.geometry}
          material={materials["Material.011"]}
        />
        <mesh
          castShadow
          receiveShadow
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

  const [settings, setSettings] = useState(() =>
    getResponsiveSettings(
      typeof window !== "undefined" ? window.innerWidth : 1280,
      typeof window !== "undefined" ? window.innerHeight : 800
    )
  );

  useEffect(() => {
    containerRef.current = document.querySelector("#three-scroll");
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const total = rect.height - window.innerHeight;

      if (total <= 0) {
        scrollProgress.current = 0;
        return;
      }

      const scrolled = -rect.top;
      scrollProgress.current = Math.min(Math.max(scrolled / total, 0), 1);
    };

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setSettings(
        getResponsiveSettings(window.innerWidth, window.innerHeight)
      );
    };

    onResize();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return (
    <div className=" hidden md:block pointer-events-none sticky top-0 z-10 h-screen w-full float-slow">
      <Canvas
        camera={settings.camera}
        dpr={settings.dpr}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={1.9} color="#ffffff" />
        <pointLight position={[-3, 4, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, -2, -5]} intensity={0.8} color="#ffffff" />

        <Model scale={settings.scale} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}