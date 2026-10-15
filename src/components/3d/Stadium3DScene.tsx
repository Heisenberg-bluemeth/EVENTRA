import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Ring } from '@react-three/drei';
import * as THREE from 'three';

const StadiumField: React.FC = () => {
  const ballRef = useRef<THREE.Mesh>(null);
  const footballRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ballRef.current) {
      ballRef.current.rotation.y = t * 1.2;
      ballRef.current.rotation.x = t * 0.8;
      ballRef.current.position.y = 0.5 + Math.sin(t * 2) * 0.2;
    }
    if (footballRef.current) {
      footballRef.current.rotation.y = -t * 0.9;
      footballRef.current.rotation.z = t * 0.7;
      footballRef.current.position.y = -0.3 + Math.cos(t * 1.8) * 0.15;
    }
  });

  return (
    <group position={[0, -0.6, 0]} rotation={[0.4, -0.3, 0]}>
      {/* Stadium Turf Pitch Surface */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[10, 0.1, 7]} />
        <meshStandardMaterial color="#064e3b" roughness={0.8} />
      </mesh>

      {/* Cricket Pitch Strip (Central Brown Clay Rect) */}
      <mesh position={[0, 0.01, 0]}>
        <planeGeometry args={[1.2, 4.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Boundary Ring */}
      <Ring args={[3.2, 3.25, 48]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </Ring>

      {/* Crease lines */}
      <mesh position={[0, 0.02, 1.8]}>
        <planeGeometry args={[1.4, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.02, -1.8]}>
        <planeGeometry args={[1.4, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Floodlight Towers */}
      {[
        [-4.5, 3.5, -3],
        [4.5, 3.5, -3],
        [-4.5, 3.5, 3],
        [4.5, 3.5, 3]
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          {/* Steel Pillar */}
          <mesh position={[0, -1.8, 0]}>
            <cylinderGeometry args={[0.08, 0.15, 3.6, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Light Grid Box */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.5, 0.2]} />
            <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={2} />
          </mesh>
          {/* Spot beam toward centre */}
          <spotLight
            position={[0, 0, 0]}
            target-position={[0, 0, 0]}
            intensity={4}
            distance={12}
            angle={0.6}
            penumbra={0.5}
            color="#e0f2fe"
          />
        </group>
      ))}

      {/* Floating 3D Red Leather Cricket Ball */}
      <mesh ref={ballRef} position={[-1.4, 0.5, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Floating 3D Cyber Football */}
      <mesh ref={footballRef} position={[1.5, -0.3, 0.8]}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#0284c7" wireframe emissive="#00f5ff" emissiveIntensity={0.8} />
      </mesh>

      <Sparkles count={50} scale={8} size={2} color="#10b981" speed={0.4} />
    </group>
  );
};

export const Stadium3DScene: React.FC<{ className?: string }> = ({ className = 'h-72 sm:h-96' }) => {
  return (
    <div className={`relative w-full ${className} rounded-3xl overflow-hidden border border-emerald-500/30 bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950 shadow-2xl`}>
      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        3D Stadium Arena • Interactive Floodlight Environment
      </div>

      <Canvas
        camera={{ position: [0, 2.5, 6.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} color="#064e3b" />
        <directionalLight position={[5, 10, 5]} intensity={1.8} color="#f0fdf4" />
        <StadiumField />
      </Canvas>
    </div>
  );
};
