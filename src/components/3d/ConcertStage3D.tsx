import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const AudioVisualizerBars: React.FC = () => {
  const barsCount = 20;
  const barsRef = useRef<THREE.Group>(null);

  const barData = useMemo(() => {
    return Array.from({ length: barsCount }, (_, i) => ({
      x: (i - barsCount / 2) * 0.35,
      phase: i * 0.4,
      color: i % 2 === 0 ? '#8b5cf6' : '#00f5ff'
    }));
  }, [barsCount]);

  useFrame((state) => {
    if (!barsRef.current) return;
    const t = state.clock.getElapsedTime();
    barsRef.current.children.forEach((child, index) => {
      const data = barData[index];
      if (data) {
        const height = Math.abs(Math.sin(t * 3 + data.phase) * 1.6) + 0.3;
        child.scale.y = height;
        child.position.y = height / 2 - 1.2;
      }
    });
  });

  return (
    <group ref={barsRef}>
      {barData.map((bar, i) => (
        <mesh key={i} position={[bar.x, -1.2, 0]}>
          <boxGeometry args={[0.22, 1, 0.22]} />
          <meshStandardMaterial
            color={bar.color}
            emissive={bar.color}
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

const ConcertStageContent: React.FC = () => {
  const laserRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (laserRef.current) {
      laserRef.current.rotation.y = Math.sin(t * 1.5) * 0.6;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Stage Truss Framework */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[9, 0.2, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      <mesh position={[-4.2, 0, 0]}>
        <boxGeometry args={[0.2, 3.8, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      <mesh position={[4.2, 0, 0]}>
        <boxGeometry args={[0.2, 3.8, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>

      {/* Sweeping Laser Beams */}
      <group ref={laserRef} position={[0, 1.7, 0]}>
        {[-3, -1, 1, 3].map((x, idx) => (
          <group key={idx} position={[x, 0, 0]}>
            <mesh position={[0, -2, 0]} rotation={[0.4, 0, (idx - 1.5) * 0.2]}>
              <cylinderGeometry args={[0.02, 0.08, 4.5, 8]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? '#00f5ff' : '#ec4899'}
                transparent
                opacity={0.7}
              />
            </mesh>
            <pointLight
              position={[0, 0, 0]}
              intensity={4}
              distance={6}
              color={idx % 2 === 0 ? '#00f5ff' : '#ec4899'}
            />
          </group>
        ))}
      </group>

      {/* Dynamic 3D Audio Visualizer Spectrum */}
      <AudioVisualizerBars />

      {/* Stage Floor */}
      <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.8} />
      </mesh>

      <Sparkles count={100} scale={8} size={2.5} color="#c084fc" speed={0.8} />
      <Sparkles count={50} scale={6} size={2.0} color="#00f5ff" speed={1.0} />
    </group>
  );
};

export const ConcertStage3D: React.FC<{ className?: string }> = ({ className = 'h-72 sm:h-96' }) => {
  return (
    <div className={`relative w-full ${className} rounded-3xl overflow-hidden border border-electric-500/30 bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950 shadow-2xl`}>
      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-950/80 border border-electric-500/40 text-[11px] font-mono text-electric-300 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
        3D Live Arena • Dynamic Audio Spectrum & Stage Lasers
      </div>

      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} color="#1e1b4b" />
        <directionalLight position={[0, 5, 5]} intensity={2.0} color="#ffffff" />
        <ConcertStageContent />
      </Canvas>
    </div>
  );
};
