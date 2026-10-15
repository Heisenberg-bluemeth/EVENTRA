import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Ring, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useEventra } from '../../context/EventraContext';

interface PortalSpec {
  id: string;
  label: string;
  tag: string;
  color: string;
  route: string;
  iconShape: 'cylinder' | 'sphere' | 'torus' | 'octahedron' | 'dodecahedron' | 'icosahedron';
  position: [number, number, number];
}

const PORTALS: PortalSpec[] = [
  { id: 'concerts', label: 'CONCERTS', tag: 'Live Music & Arena Tours', color: '#8b5cf6', route: '/concerts', iconShape: 'cylinder', position: [-3.8, 1.2, -0.5] },
  { id: 'sports', label: 'SPORTS', tag: 'Cricket, Football & Derby', color: '#10b981', route: '/sports', iconShape: 'sphere', position: [0, 1.8, 0.4] },
  { id: 'movies', label: 'CINEMA', tag: 'IMAX 3D & Premieres', color: '#f43f5e', route: '/movies', iconShape: 'torus', position: [3.8, 1.2, -0.5] },
  { id: 'festivals', label: 'FESTIVALS', tag: 'EDM & Multi-Day Fests', color: '#00f5ff', route: '/category/festivals', iconShape: 'dodecahedron', position: [-2.6, -1.8, 0.2] },
  { id: 'comedy', label: 'STANDUP', tag: 'World Comedy Tours', color: '#f59e0b', route: '/category/comedy', iconShape: 'octahedron', position: [0, -1.9, 0.6] },
  { id: 'gaming', label: 'GAMING', tag: 'Esports & Global Cups', color: '#ec4899', route: '/category/gaming', iconShape: 'icosahedron', position: [2.6, -1.8, 0.2] }
];

const PortalMesh: React.FC<{ portal: PortalSpec; onSelect: (route: string) => void }> = ({ portal, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (hovered ? 1.5 : 0.6);
    }
    if (hovered) {
      groupRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={portal.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(portal.route);
      }}
    >
      {/* Outer Hologram Portal Ring */}
      <Ring ref={ringRef} args={[1.05, 1.18, 36]}>
        <meshStandardMaterial
          color={hovered ? '#ffffff' : portal.color}
          emissive={portal.color}
          emissiveIntensity={hovered ? 1.8 : 0.8}
          wireframe={!hovered}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Translucent Portal Glass Disc */}
      <mesh position={[0, 0, -0.05]}>
        <circleGeometry args={[1.0, 32]} />
        <meshPhysicalMaterial
          color="#060914"
          transmission={0.6}
          roughness={0.2}
          reflectivity={0.9}
          clearcoat={1}
          emissive={portal.color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </mesh>

      {/* Internal Core Floating Symbol */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh position={[0, 0, 0.2]}>
          {portal.iconShape === 'sphere' && <sphereGeometry args={[0.42, 24, 24]} />}
          {portal.iconShape === 'torus' && <torusGeometry args={[0.38, 0.12, 16, 32]} />}
          {portal.iconShape === 'cylinder' && <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />}
          {portal.iconShape === 'dodecahedron' && <dodecahedronGeometry args={[0.4]} />}
          {portal.iconShape === 'octahedron' && <octahedronGeometry args={[0.44]} />}
          {portal.iconShape === 'icosahedron' && <icosahedronGeometry args={[0.42]} />}
          <meshStandardMaterial
            color={hovered ? '#ffffff' : portal.color}
            emissive={portal.color}
            emissiveIntensity={hovered ? 2.2 : 0.9}
            metalness={0.8}
            roughness={0.2}
            wireframe={!hovered}
          />
        </mesh>
      </Float>

      {/* Title Text */}
      <Text
        position={[0, -1.35, 0.1]}
        fontSize={0.22}
        color={hovered ? '#00f5ff' : '#ffffff'}
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-g.woff"
        anchorX="center"
        anchorY="middle"
      >
        {portal.label}
      </Text>

      {/* Subtitle tag */}
      <Text
        position={[0, -1.6, 0.1]}
        fontSize={0.11}
        color={hovered ? '#e2e8f0' : '#94a3b8'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
        textAlign="center"
      >
        {portal.tag}
      </Text>

      {/* Hover point light */}
      {hovered && (
        <pointLight position={[0, 0, 1.2]} intensity={4} distance={3} color={portal.color} />
      )}
    </group>
  );
};

const PortalsUniverseScene: React.FC<{ onSelect: (route: string) => void }> = ({ onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.18, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.12, 0.05);
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.8} color="#0d1324" />
      <directionalLight position={[0, 6, 8]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, 4]} intensity={2.0} color="#8b5cf6" />

      {PORTALS.map((portal) => (
        <PortalMesh key={portal.id} portal={portal} onSelect={onSelect} />
      ))}

      <Sparkles count={120} scale={12} size={2.5} speed={0.5} color="#00f5ff" opacity={0.6} />
      <Sparkles count={80} scale={10} size={2.0} speed={0.4} color="#8b5cf6" opacity={0.5} />
    </group>
  );
};

export const EventUniversePortals: React.FC = () => {
  const navigate = useNavigate();
  const { is3DEnabled } = useEventra();

  const handleSelect = (route: string) => {
    navigate(route);
  };

  if (!is3DEnabled) {
    // 2D High Performance Alternative
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-8">
        {PORTALS.map((portal) => (
          <div
            key={portal.id}
            onClick={() => handleSelect(portal.route)}
            className="group cursor-pointer p-5 rounded-2xl bg-midnight-900 border border-midnight-700/80 hover:border-electric-500/50 hover:bg-midnight-850 hover:shadow-glow-card transition-all text-center"
          >
            <div
              className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-md"
              style={{ backgroundColor: `${portal.color}20`, borderColor: portal.color }}
            >
              <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: portal.color }} />
            </div>
            <h4 className="font-display font-bold text-sm text-white group-hover:text-cyber-cyan transition-colors">
              {portal.label}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{portal.tag}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[640px] rounded-3xl overflow-hidden border border-midnight-700/60 bg-gradient-to-b from-midnight-950/80 via-midnight-900/60 to-midnight-950/90 shadow-2xl backdrop-blur-sm">
      {/* Top instruction badge */}
      <div className="absolute top-4 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-midnight-900/90 border border-electric-500/40 text-[11px] font-mono text-electric-300 shadow-md backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
          Interactive 3D Universe • Click any portal to enter
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 46 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <PortalsUniverseScene onSelect={handleSelect} />
      </Canvas>

      {/* Bottom overlay gradient */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-midnight-950 to-transparent pointer-events-none" />
    </div>
  );
};
