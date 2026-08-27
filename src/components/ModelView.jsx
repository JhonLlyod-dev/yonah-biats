import React, { useRef } from "react";
import { Canvas, useFrame,useThree  } from "@react-three/fiber";
import {
  OrbitControls,
  Center,
  Environment,
} from "@react-three/drei";
import { useGLTF } from "@react-three/drei";

// ========================================
// MODEL CONTROLS
// ========================================

const modelScale = .07;

// X = left / right
// Y = down / up
// Z = forward / backward
const modelPosition = [0, 0, 0];

// Slow automatic rotation
const rotationSpeed = 0.15;


// ========================================
// MODEL
// ========================================

function Model(props) {
  const { nodes, materials } = useGLTF("/models/yonah.glb");

  return (
    <group {...props} dispose={null}>
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


// ========================================
// ANIMATED MODEL
// ========================================

function AnimatedModel() {
  const modelRef = useRef();
  const { size } = useThree();

  const isMobile = size.width < 640;

  const responsiveScale = isMobile
    ? modelScale * 0.8
    : modelScale;

  useFrame((_, delta) => {
    if (!modelRef.current) return;

    modelRef.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <group
      ref={modelRef}
      scale={responsiveScale}
      position={modelPosition}
    >
      <Center>
        <Model />
      </Center>
    </group>
  );
}


// ========================================
// CANVAS
// ========================================

export default function ModelView() {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen">
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 35,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={1.9} color="#ffffff" />
        <pointLight position={[-3, 4, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, -2, -5]} intensity={0.8} color="#ffffff" />

        <AnimatedModel />

        <Environment preset="city" />

        <OrbitControls
          enabled={true}
          enablePan={false}
          enableZoom={false}
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/yonah.glb");