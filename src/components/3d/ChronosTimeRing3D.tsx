import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Ring, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const TimeRingsScene: React.FC = () => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.4;
      ring1.current.rotation.y = t * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y = -t * 0.5;
      ring2.current.rotation.z = t * 0.3;
    }
    if (ring3.current) {
      ring3.current.rotation.x = -t * 0.3;
      ring3.current.rotation.z = -t * 0.4;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.8;
      const s = 1 + Math.sin(t * 2) * 0.1;
      coreRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Time Ring */}
      <Ring ref={ring1} args={[2.2, 2.3, 48]}>
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Middle Gyro Ring */}
      <Ring ref={ring2} args={[1.7, 1.8, 36]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.9}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Inner Spatial Ring */}
      <Ring ref={ring3} args={[1.2, 1.28, 32]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={1.2}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Pulsing Core Chronos Octahedron */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
        <mesh ref={coreRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[0.55]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#00f5ff"
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      <pointLight position={[0, 0, 0]} intensity={3.5} distance={6} color="#00f5ff" />
      <Sparkles count={70} scale={6} size={2} color="#f59e0b" speed={0.5} />
    </group>
  );
};

export const ChronosTimeRing3D: React.FC<{ className?: string }> = ({ className = 'h-64 sm:h-80' }) => {
  return (
    <div className={`relative w-full ${className} rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950 shadow-2xl`}>
      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-[11px] font-mono text-amber-300 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        The Time Dimension • 3D Chronos Continuum
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 46 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} color="#451a03" />
        <directionalLight position={[0, 5, 5]} intensity={1.5} color="#ffffff" />
        <TimeRingsScene />
      </Canvas>
    </div>
  );
};
