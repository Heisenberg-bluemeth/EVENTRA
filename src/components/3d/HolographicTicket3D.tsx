import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Booking } from '../../types/event';

interface TicketModelProps {
  booking: Booking;
}

const TicketMesh: React.FC<TicketModelProps> = ({ booking }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ pointer }) => {
    if (!meshRef.current) return;
    if (hovered) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, pointer.x * 0.45, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -pointer.y * 0.35, 0.1);
    } else {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.05);
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Main Ticket Rounded Plate */}
        <RoundedBox args={[3.2, 5.0, 0.08]} radius={0.16} smoothness={4}>
          <meshPhysicalMaterial
            color="#090d1a"
            metalness={0.8}
            roughness={0.25}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            reflectivity={0.9}
            emissive={hovered ? '#8b5cf6' : '#00f5ff'}
            emissiveIntensity={hovered ? 0.25 : 0.1}
          />
        </RoundedBox>

        {/* Top Header Badge */}
        <Text
          position={[0, 2.05, 0.05]}
          fontSize={0.16}
          color="#00f5ff"
          font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-g.woff"
          anchorX="center"
          anchorY="middle"
        >
          EVENTRA PASS • VERIFIED
        </Text>

        {/* Event Title */}
        <Text
          position={[0, 1.45, 0.05]}
          fontSize={0.2}
          color="#ffffff"
          maxWidth={2.8}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          {booking.eventTitle}
        </Text>

        {/* Date & Time */}
        <Text
          position={[0, 0.85, 0.05]}
          fontSize={0.15}
          color="#a78bfa"
          anchorX="center"
          anchorY="middle"
        >
          {booking.eventDate} • {booking.eventTime}
        </Text>

        {/* Venue & City */}
        <Text
          position={[0, 0.5, 0.05]}
          fontSize={0.13}
          color="#94a3b8"
          maxWidth={2.8}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          {booking.venue}, {booking.city}
        </Text>

        {/* Perforated separator line */}
        <mesh position={[0, 0.1, 0.05]}>
          <planeGeometry args={[2.8, 0.02]} />
          <meshBasicMaterial color="#334155" />
        </mesh>

        {/* Tier & Seats */}
        <Text
          position={[-0.8, -0.3, 0.05]}
          fontSize={0.12}
          color="#64748b"
          anchorX="center"
        >
          TIER
        </Text>
        <Text
          position={[-0.8, -0.55, 0.05]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
        >
          {booking.tierName.slice(0, 14)}
        </Text>

        <Text
          position={[0.8, -0.3, 0.05]}
          fontSize={0.12}
          color="#64748b"
          anchorX="center"
        >
          SEATS
        </Text>
        <Text
          position={[0.8, -0.55, 0.05]}
          fontSize={0.15}
          color="#00f5ff"
          anchorX="center"
        >
          {booking.seats.length > 0 ? booking.seats.join(', ') : `Qty: ${booking.quantity}`}
        </Text>

        {/* Simulated 3D QR Code Box */}
        <mesh position={[0, -1.35, 0.05]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, -1.35, 0.052]}>
          <planeGeometry args={[1.0, 1.0]} />
          <meshBasicMaterial color="#000000" wireframe />
        </mesh>

        {/* Booking Reference Code */}
        <Text
          position={[0, -2.15, 0.05]}
          fontSize={0.13}
          color="#94a3b8"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_ad53Wl.woff"
          anchorX="center"
          anchorY="middle"
        >
          {booking.reference}
        </Text>
      </Float>
    </group>
  );
};

export const HolographicTicket3D: React.FC<{ booking: Booking; className?: string }> = ({
  booking,
  className = 'h-96'
}) => {
  return (
    <div className={`relative w-full ${className} rounded-3xl overflow-hidden border border-electric-500/40 bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950 shadow-holographic`}>
      <div className="absolute top-3 left-4 z-10 text-[10px] font-mono text-cyber-cyan uppercase tracking-wider">
        3D Holographic Pass • Move mouse to inspect
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} color="#1e1b4b" />
        <pointLight position={[3, 4, 3]} intensity={2.5} color="#00f5ff" />
        <pointLight position={[-3, -4, 2]} intensity={2.0} color="#8b5cf6" />
        <directionalLight position={[0, 6, 4]} intensity={1.5} color="#ffffff" />

        <TicketMesh booking={booking} />
      </Canvas>
    </div>
  );
};
