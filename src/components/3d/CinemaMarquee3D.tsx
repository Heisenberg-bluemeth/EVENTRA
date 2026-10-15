import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const CinemaSceneContent: React.FC = () => {
  const reelRef1 = useRef<THREE.Group>(null);
  const reelRef2 = useRef<THREE.Group>(null);
  const projectorBeamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (reelRef1.current) {
      reelRef1.current.rotation.z = t * 1.5;
    }
    if (reelRef2.current) {
      reelRef2.current.rotation.z = -t * 1.8;
    }
    if (projectorBeamRef.current) {
      projectorBeamRef.current.rotation.y = Math.sin(t * 0.8) * 0.05;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Volumetric Projector Light Cone */}
      <mesh ref={projectorBeamRef} position={[0, 1.2, -1]} rotation={[-1.2, 0, 0]}>
        <coneGeometry args={[2.8, 6.5, 32, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Projector Lens Emissive Glow */}
      <mesh position={[0, 3.8, -3.8]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight position={[0, 3.8, -3.8]} intensity={6} distance={10} color="#38bdf8" />

      {/* Floating 3D Film Reel 1 */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={reelRef1} position={[-2.4, 0.4, 0.5]}>
          <Cylinder args={[1.0, 1.0, 0.12, 24]}>
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[0.95, 0.95, 0.14, 8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.6} wireframe />
          </Cylinder>
        </group>
      </Float>

      {/* Floating 3D Film Reel 2 */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <group ref={reelRef2} position={[2.6, -0.3, 0.8]}>
          <Cylinder args={[0.8, 0.8, 0.1, 24]}>
            <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.3} />
          </Cylinder>
          <Cylinder args={[0.75, 0.75, 0.12, 6]}>
            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.8} wireframe />
          </Cylinder>
        </group>
      </Float>

      {/* Curved Screen Curve at Bottom */}
      <mesh position={[0, -1.8, 0]} rotation={[-0.4, 0, 0]}>
        <cylinderGeometry args={[5, 5, 0.4, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.5} />
      </mesh>

      <Sparkles count={60} scale={7} size={2} color="#f43f5e" speed={0.4} />
      <Sparkles count={40} scale={7} size={1.8} color="#00f5ff" speed={0.6} />
    </group>
  );
};

export const CinemaMarquee3D: React.FC<{ className?: string }> = ({ className = 'h-72 sm:h-96' }) => {
  return (
    <div className={`relative w-full ${className} rounded-3xl overflow-hidden border border-rose-500/30 bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950 shadow-2xl`}>
      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-[11px] font-mono text-rose-300 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
        3D Cinema Dimension • Volumetric Projection & 70mm Reels
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 46 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} color="#18181b" />
        <directionalLight position={[0, 4, 4]} intensity={1.5} color="#fed7aa" />
        <CinemaSceneContent />
      </Canvas>
    </div>
  );
};
