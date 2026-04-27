import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Cylinder, useTexture } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';
import * as THREE from 'three';

export default function Office() {
  const { leftDoorOpen, rightDoorOpen, leftLight, rightLight, energy } = useGameStore();
  
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (leftDoorRef.current) {
        leftDoorRef.current.position.y = THREE.MathUtils.lerp(leftDoorRef.current.position.y, leftDoorOpen ? 2.5 : 0.8, 0.1);
    }
    if (rightDoorRef.current) {
        rightDoorRef.current.position.y = THREE.MathUtils.lerp(rightDoorRef.current.position.y, rightDoorOpen ? 2.5 : 0.8, 0.1);
    }
  });

  return (
    <group>
      {/* Floor with a tiled pattern-like texture */}
      <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </Plane>

      {/* Ceiling */}
      <Plane args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <meshStandardMaterial color="#050505" />
      </Plane>

      {/* Walls with structural details */}
      <Box args={[0.5, 3, 6]} position={[-2.5, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.5, 3, 6]} position={[2.5, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[6, 3, 0.5]} position={[0, 1.5, -2.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#141414" />
      </Box>

      {/* Vent (Top Wall) */}
      <group position={[0, 2.4, -2.25]}>
        <Box args={[1.6, 0.8, 0.1]}>
           <meshStandardMaterial color="#000" />
        </Box>
        {[...Array(6)].map((_, i) => (
           <Box key={i} args={[1.5, 0.05, 0.05]} position={[0, (i * 0.12) - 0.3, 0.05]}>
              <meshStandardMaterial color="#222" />
           </Box>
        ))}
      </group>

      {/* Doors Frames */}
      <Box args={[0.2, 3, 2]} position={[-2.3, 1.5, 0]}><meshStandardMaterial color="#000" /></Box>
      <Box args={[0.2, 3, 2]} position={[2.3, 1.5, 0]}><meshStandardMaterial color="#000" /></Box>

      {/* Left Door */}
      <group ref={leftDoorRef} position={[-2.25, 2.5, 0]}>
        <Box args={[0.1, 2.5, 2]}>
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Door details */}
        <Box args={[0.12, 0.2, 1.8]} position={[0, -0.8, 0]}><meshStandardMaterial color="#444" /></Box>
      </group>

      {/* Right Door */}
      <group ref={rightDoorRef} position={[2.25, 2.5, 0]}>
        <Box args={[0.1, 2.5, 2]}>
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Door details */}
        <Box args={[0.12, 0.2, 1.8]} position={[0, -0.8, 0]}><meshStandardMaterial color="#444" /></Box>
      </group>

      {/* Hallway Lights (The ones you toggle) */}
      {leftLight && energy > 0 && (
        <group position={[-3.5, 2, 0]}>
            <pointLight intensity={3} color="#fff" distance={6} castShadow />
            <Box args={[0.1, 0.1, 0.1]}><meshStandardMaterial emissive="#fff" emissiveIntensity={10} /></Box>
        </group>
      )}
      {rightLight && energy > 0 && (
        <group position={[3.5, 2, 0]}>
            <pointLight intensity={3} color="#fff" distance={6} castShadow />
            <Box args={[0.1, 0.1, 0.1]}><meshStandardMaterial emissive="#fff" emissiveIntensity={10} /></Box>
        </group>
      )}

      {/* Desk with clutter */}
      <group position={[0, 0.7, -1.8]}>
        <Box args={[4, 0.1, 1.5]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" metalness={0.2} />
        </Box>
        
        {/* Monitor */}
        <group position={[0, 0.4, -0.2]}>
            <Box args={[1.2, 0.8, 0.1]}><meshStandardMaterial color="#000" /></Box>
            <Plane args={[1.1, 0.7]} position={[0, 0, 0.06]}>
                <meshStandardMaterial emissive="#051" emissiveIntensity={0.2} color="#020" />
            </Plane>
        </group>

        {/* Scattered "Miojo Packs" (Colored boxes) */}
        <MiojoPack position={[-1, 0.1, 0.2]} rotation={[0, 0.5, 0]} color="#fcd34d" />
        <MiojoPack position={[-1.2, 0.15, 0.4]} rotation={[0, -0.2, 0]} color="#ef4444" />
        <MiojoPack position={[0.8, 0.1, 0.3]} rotation={[0.4, 0.1, 0]} color="#8b5cf6" />
        
        {/* Fan */}
        <group position={[1.4, 0.3, 0.2]}>
            <Cylinder args={[0.2, 0.2, 0.1]} rotation={[Math.PI/2, 0, 0]}>
                <meshStandardMaterial color="#111" />
            </Cylinder>
            <pointLight color="#fff" intensity={0.1} distance={2} />
        </group>
      </group>

      {/* Mood Lighting */}
      <pointLight position={[0, 2.5, 0]} intensity={0.15} color="#fca" distance={10} />
      <spotLight position={[0, 3, 2]} angle={0.5} penumbra={1} intensity={0.2} color="#fff" />
    </group>
  );
}

function MiojoPack({ position, rotation, color }: any) {
    return (
        <Box args={[0.2, 0.1, 0.3]} position={position} rotation={rotation} castShadow>
            <meshStandardMaterial color={color} />
        </Box>
    );
}
