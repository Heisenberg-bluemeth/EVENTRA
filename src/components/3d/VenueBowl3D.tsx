import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface SectionSpec {
  id: string;
  name: string;
  color: string;
  price: number;
  available: number;
  pos: [number, number, number];
  rot: [number, number, number];
  size: [number, number, number];
}

const SECTIONS: SectionSpec[] = [
  { id: 'sec-vip', name: 'VIP Pavilion & Hospitality', color: '#8b5cf6', price: 9500, available: 25, pos: [0, -0.6, 1.8], rot: [-0.3, 0, 0], size: [3.4, 0.4, 1.2] },
  { id: 'sec-club', name: 'Sachin Tendulkar Stand (Mid)', color: '#00f5ff', price: 3500, available: 180, pos: [0, 0.2, 0.8], rot: [-0.5, 0, 0], size: [5.2, 0.5, 1.2] },
  { id: 'sec-north', name: 'North Grandstand Upper', color: '#10b981', price: 1800, available: 420, pos: [0, 1.2, -0.2], rot: [-0.7, 0, 0], size: [6.8, 0.6, 1.2] },
  { id: 'sec-east', name: 'East Wing Pavilion', color: '#f59e0b', price: 2400, available: 95, pos: [-3.8, 0.3, 0.6], rot: [-0.4, 0.6, 0], size: [2.0, 0.5, 2.2] },
  { id: 'sec-west', name: 'West Wing Pavilion', color: '#ec4899', price: 2400, available: 110, pos: [3.8, 0.3, 0.6], rot: [-0.4, -0.6, 0], size: [2.0, 0.5, 2.2] },
];

const VenueSectionMesh: React.FC<{
  section: SectionSpec;
  isSelected: boolean;
  onSelect: (sec: SectionSpec) => void;
}> = ({ section, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={section.pos}
      rotation={section.rot}
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
        onSelect(section);
      }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={section.size} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : hovered ? section.color : '#131b31'}
          emissive={section.color}
          emissiveIntensity={isSelected ? 1.5 : hovered ? 1.0 : 0.3}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      <Text
        position={[0, 0.35, 0.1]}
        fontSize={0.16}
        color={hovered || isSelected ? '#ffffff' : '#e2e8f0'}
        anchorX="center"
        anchorY="middle"
      >
        {section.name.toUpperCase()}
      </Text>

      <Text
        position={[0, 0.15, 0.1]}
        fontSize={0.13}
        color={hovered || isSelected ? '#00f5ff' : '#94a3b8'}
        anchorX="center"
        anchorY="middle"
      >
        ₹{section.price.toLocaleString()} • {section.available} Seats
      </Text>
    </group>
  );
};

export const VenueBowl3D: React.FC<{
  selectedSectionId?: string;
  onSelectSection: (section: SectionSpec) => void;
  className?: string;
}> = ({ selectedSectionId, onSelectSection, className = 'h-80 sm:h-96' }) => {
  return (
    <div className={`relative w-full ${className} rounded-3xl overflow-hidden border border-midnight-700 bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950 shadow-2xl`}>
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse" />
        <span className="text-xs font-mono text-slate-300">
          3D Stadium Bowl • Click a section to choose seats
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 4.5, 6.8], fov: 46 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} color="#0f172a" />
        <directionalLight position={[0, 10, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[0, 2, 2]} intensity={2.0} color="#00f5ff" />

        {/* Central Stage / Turf Circle */}
        <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.0, 32]} />
          <meshStandardMaterial color="#064e3b" roughness={0.7} />
        </mesh>
        <Text position={[0, -0.88, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="#ffffff">
          CENTRAL ARENA
        </Text>

        {SECTIONS.map((sec) => (
          <VenueSectionMesh
            key={sec.id}
            section={sec}
            isSelected={selectedSectionId === sec.id}
            onSelect={onSelectSection}
          />
        ))}
      </Canvas>
    </div>
  );
};
