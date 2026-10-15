import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import { useEventra } from '../../context/EventraContext';

// Floating geometric cyber polyhedrons
const FloatingPrisms: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);
  const meshRef3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef1.current) {
      meshRef1.current.rotation.x = t * 0.15;
      meshRef1.current.rotation.y = t * 0.2;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.y = -t * 0.12;
      meshRef2.current.rotation.z = t * 0.18;
    }
    if (meshRef3.current) {
      meshRef3.current.rotation.x = t * 0.1;
      meshRef3.current.rotation.z = -t * 0.14;
    }
  });

  return (
    <group>
      {/* Top right floating icosahedron */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={meshRef1} position={[4.2, 2.5, -4]}>
          <icosahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial
            color="#141b31"
            wireframe
            wireframeLinewidth={2}
            emissive={accentColor}
            emissiveIntensity={0.4}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Mid left floating torus ring */}
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={meshRef2} position={[-4.5, -1.2, -3]}>
          <torusGeometry args={[1.2, 0.12, 16, 50]} />
          <meshStandardMaterial
            color="#080c18"
            emissive="#00f5ff"
            emissiveIntensity={0.35}
            roughness={0.3}
          />
        </mesh>
      </Float>

      {/* Far bottom right octahedron */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef3} position={[3.8, -3.2, -5]}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial
            color="#131b31"
            wireframe
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
    </group>
  );
};

// Cosmic Cyber Particles
const AtmosphericParticles: React.FC<{ count?: number }> = ({ count = 350 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#00f5ff'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#a78bfa')
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = Math.sin(t * 0.01) * 0.03;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.65}
      />
    </Points>
  );
};

// Parallax Scene Controller
const AtmosphereScene: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    // Smooth responsive camera parallax
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pointer.x * 0.6, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pointer.y * 0.4, 0.04);
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} color="#0d1324" />
      <pointLight position={[6, 8, 4]} intensity={2.5} distance={15} color="#8b5cf6" />
      <pointLight position={[-6, -6, 2]} intensity={2.0} distance={15} color="#00f5ff" />
      <directionalLight position={[0, 10, 5]} intensity={0.6} color="#ffffff" />

      <FloatingPrisms accentColor={accentColor} />
      <AtmosphericParticles />
    </group>
  );
};

export const GlobalAtmosphereCanvas: React.FC = () => {
  const { is3DEnabled } = useEventra();
  const location = useLocation();

  // Adapt accent glow based on route
  const accentColor = useMemo(() => {
    if (location.pathname.startsWith('/sports')) return '#10b981';
    if (location.pathname.startsWith('/movies')) return '#f43f5e';
    if (location.pathname.startsWith('/concerts') || location.pathname.startsWith('/festivals')) return '#00f5ff';
    if (location.pathname.startsWith('/calendar')) return '#f59e0b';
    return '#8b5cf6';
  }, [location.pathname]);

  if (!is3DEnabled) {
    // 2D High Performance Fallback background
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-electric-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Radial depth vignettes */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-midnight-950/40 to-midnight-950/90 z-10" />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <AtmosphereScene accentColor={accentColor} />
      </Canvas>
    </div>
  );
};
