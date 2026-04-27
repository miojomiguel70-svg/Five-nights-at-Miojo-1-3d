import { useGameStore } from '../../store/useGameStore';
import { Box, Sphere, Cylinder, Plane, Torus } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Animatronics({ forceVisibleId }: { forceVisibleId?: string }) {
  const { animatronics, leftLight, rightLight, energy } = useGameStore();

  return (
    <group>
      {animatronics.map((a) => {
        const isForced = forceVisibleId === a.id;
        
        // During jumpscare, only show the forced one
        if (forceVisibleId && !isForced) return null;

        return (
          <AnimatronicModel 
              key={a.id} 
              id={a.id} 
              location={isForced ? 'OFFICE' : a.location} 
              visible={
                  isForced ||
                  (a.location === 'AISLE_1' && leftLight && energy > 0) ||
                  (a.location === 'AISLE_2' && rightLight && energy > 0) ||
                  (a.location !== 'AISLE_1' && a.location !== 'AISLE_2' && a.location !== 'OFFICE')
              }
          />
        );
      })}
    </group>
  );
}

function AnimatronicModel({ id, location, visible }: any) {
  const modelRef = useRef<THREE.Group>(null);

  // Map locations to 3D coordinates (Convenience Store layout)
  // Adjusted to match Factory.tsx absolute positions
  const positions: Record<string, [number, number, number]> = {
    'STORAGE': [0, 1.2, -42],
    'ENTRANCE': [5, 1.2, 12],
    'COUNTER': [12, 1.2, -5],
    'FRIDGES': [22, 1.2, -25],
    'AISLE_1': [-10, 1, -25],
    'AISLE_2': [0, 1, -25],
    'OFFICE': [0, 1.2, 0],
  };

  const pos = positions[location] || [0, -10, 0];

  const getDetails = () => {
    switch (id) {
      case 'miojo': 
        return { 
          name: 'Miojo',
          type: 'box',
          color: '#fcd34d', 
          brandColor: '#ff0000',
          eyeColor: '#ff0000', 
          noodleColor: '#fffbeb'
        };
      case 'nissin': 
        return { 
          name: 'Nissin',
          type: 'box',
          color: '#ffffff', 
          brandColor: '#ef4444',
          eyeColor: '#ff00ff', 
          noodleColor: '#fde68a'
        };
      case 'lamen': 
        return { 
          name: 'Lamen',
          type: 'bowl',
          color: '#e5e7eb', 
          brandColor: '#1f2937',
          eyeColor: '#00ffff', 
          noodleColor: '#f3f4f6'
        };
      default: 
        return { color: '#fff', eyeColor: '#f00', noodleColor: '#fff' };
    }
  };

  const details = getDetails();

  return (
    <group position={pos} visible={visible} ref={modelRef}>
      {/* Base "Endoskeleton" Joints */}
      <Sphere args={[0.08, 8, 8]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#333" metalness={1} roughness={0.1} />
      </Sphere>

      {/* Exposed Wires and Mechanical Core */}
      <group position={[0, 0, 0]}>
         <Cylinder args={[0.05, 0.05, 0.8]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#111" metalness={1} />
         </Cylinder>
      </group>

      {/* Character Specific Body */}
      {id === 'miojo' && (
        <group position={[0, 0, 0]}>
            {/* Box Body with rips */}
            <Box args={[0.6, 0.8, 0.4]}>
                <meshStandardMaterial color="#fcd34d" roughness={0.2} metalness={0.1} />
            </Box>
            <Box args={[0.5, 0.3, 0.41]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#ff0000" />
            </Box>
            {/* Exposed Internal Wires in the rips */}
            <group position={[0.2, -0.1, 0.21]}>
               <Box args={[0.15, 0.3, 0.01]}><meshStandardMaterial color="#111" /></Box>
               {[...Array(3)].map((_, i) => (
                   <Cylinder key={i} args={[0.005, 0.005, 0.2]} position={[0, (i-1)*0.05, 0.01]} rotation={[0,0,Math.PI/2]}>
                       <meshStandardMaterial color={i === 1 ? "red" : "blue"} />
                   </Cylinder>
               ))}
            </group>
        </group>
      )}

      {id === 'nissin' && (
        <group position={[0, 0, 0]}>
            {/* Cup/Pack Shape */}
            <Cylinder args={[0.3, 0.25, 0.8, 8]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </Cylinder>
            {/* Red brand bands */}
            <Cylinder args={[0.31, 0.31, 0.1]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#ef4444" />
            </Cylinder>
            <Cylinder args={[0.31, 0.31, 0.1]} position={[0, -0.1, 0]}>
                <meshStandardMaterial color="#ef4444" />
            </Cylinder>
            {/* Oil stains */}
            <Sphere args={[0.1]} position={[0.2, 0, 0.2]} scale={[1, 0.2, 1]}>
                <meshStandardMaterial color="#222" transparent opacity={0.6} />
            </Sphere>
        </group>
      )}

      {id === 'lamen' && (
        <group position={[0, 0, 0]}>
            {/* The Ceramic Bowl */}
            <group position={[0, 0.2, 0]}>
                <Cylinder args={[0.5, 0.3, 0.4, 32]} rotation={[0, 0, 0]}>
                    <meshStandardMaterial color="#eee" roughness={0.2} side={THREE.DoubleSide} />
                </Cylinder>
                {/* Black oil sludge inside */}
                <Cylinder args={[0.42, 0.42, 0.05]} position={[0, 0.1, 0]}>
                    <meshStandardMaterial color="#000" roughness={1} />
                </Cylinder>
                {/* Single cyclopic glowing eye floating in the sludge */}
                <group position={[0, 0.15, 0]}>
                    <Sphere args={[0.08, 16, 16]}>
                        <meshStandardMaterial color="#111" />
                    </Sphere>
                    <Sphere args={[0.03, 8, 8]} position={[0, 0, 0.06]}>
                        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} />
                    </Sphere>
                </group>
            </group>

            {/* Spider Legs (8 Legs coming from under the bowl) */}
            <group position={[0, 0, 0]}>
                {[...Array(8)].map((_, i) => (
                    <group key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
                        <group position={[0.4, 0, 0]} rotation={[0, 0, -0.5]}>
                             <Box args={[0.6, 0.03, 0.03]}>
                                 <meshStandardMaterial color="#222" metalness={1} />
                             </Box>
                             <group position={[0.3, -0.2, 0]} rotation={[0, 0, 1.2]}>
                                 <Box args={[0.6, 0.02, 0.02]}>
                                     <meshStandardMaterial color="#222" metalness={1} />
                                 </Box>
                                 {/* Sharp point */}
                                 <Box args={[0.1, 0.01, 0.01]} position={[0.3, 0, 0]}>
                                     <meshStandardMaterial color="#666" metalness={1} />
                                 </Box>
                             </group>
                        </group>
                    </group>
                ))}
            </group>
        </group>
      )}

      {/* Mechanical Head with Eyes (Only for Miojo and Nissin) */}
      {(id === 'miojo' || id === 'nissin') && (
        <group position={[0, 0.55, 0]}>
            <Box args={[0.3, 0.25, 0.3]}>
                <meshStandardMaterial color="#111" metalness={0.8} />
            </Box>
            
            {/* Glowing Eyes */}
            <group position={[-0.1, 0.05, 0.12]}>
                <Sphere args={[0.04, 12, 12]}>
                    <meshStandardMaterial color="#000" />
                </Sphere>
                <Sphere args={[0.015, 8, 8]} position={[0, 0, 0.03]}>
                    <meshStandardMaterial color={details.eyeColor} emissive={details.eyeColor} emissiveIntensity={10} />
                </Sphere>
            </group>
            <group position={[0.1, 0.05, 0.12]}>
                <Sphere args={[0.04, 12, 12]}>
                    <meshStandardMaterial color="#000" />
                </Sphere>
                <Sphere args={[0.015, 8, 8]} position={[0, 0, 0.03]}>
                    <meshStandardMaterial color={details.eyeColor} emissive={details.eyeColor} emissiveIntensity={10} />
                </Sphere>
            </group>

            {/* Sharp Teeth on a mechanical jaw */}
            <group position={[0, -0.15, 0.1]}>
                <Box args={[0.25, 0.05, 0.1]}>
                    <meshStandardMaterial color="#333" />
                </Box>
                {[...Array(5)].map((_, i) => (
                    <Box key={i} args={[0.01, 0.05, 0.01]} position={[(i * 0.05) - 0.1, -0.03, 0.05]}>
                        <meshStandardMaterial color="#eee" metalness={1} />
                    </Box>
                ))}
            </group>
        </group>
      )}

      {/* Robotic Limbs (Only for Miojo and Nissin) */}
      {(id === 'miojo' || id === 'nissin') && (
        <>
            {/* Scrawny Arms with Giant Claws */}
            <group position={[-0.35, 0.2, 0]}>
                <Cylinder args={[0.02, 0.02, 0.7]} rotation={[0, 0, 1]}>
                    <meshStandardMaterial color="#111" metalness={1} />
                </Cylinder>
                {/* Claw */}
                <group position={[-0.6, -0.4, 0]} rotation={[0, 0, 0.5]}>
                    <Box args={[0.05, 0.3, 0.05]} position={[0, 0, 0]}><meshStandardMaterial color="#444" /></Box>
                    <Box args={[0.02, 0.4, 0.02]} position={[-0.1, 0, 0]} rotation={[0,0,0.2]}><meshStandardMaterial color="#eee" metalness={1} /></Box>
                    <Box args={[0.02, 0.4, 0.02]} position={[0.1, 0, 0]} rotation={[0,0,-0.2]}><meshStandardMaterial color="#eee" metalness={1} /></Box>
                </group>
            </group>
            <group position={[0.35, 0.2, 0]}>
                <Cylinder args={[0.02, 0.02, 0.7]} rotation={[0, 0, -1]}>
                    <meshStandardMaterial color="#111" metalness={1} />
                </Cylinder>
                {/* Claw */}
                <group position={[0.6, -0.4, 0]} rotation={[0, 0, -0.5]}>
                    <Box args={[0.05, 0.3, 0.05]} position={[0, 0, 0]}><meshStandardMaterial color="#444" /></Box>
                    <Box args={[0.02, 0.4, 0.02]} position={[-0.1, 0, 0]} rotation={[0,0,0.2]}><meshStandardMaterial color="#eee" metalness={1} /></Box>
                    <Box args={[0.02, 0.4, 0.02]} position={[0.1, 0, 0]} rotation={[0,0,-0.2]}><meshStandardMaterial color="#eee" metalness={1} /></Box>
                </group>
            </group>

            {/* Long thin robotic legs */}
            <group position={[-0.15, -0.4, 0]}>
                <Cylinder args={[0.02, 0.02, 1]} position={[0, -0.5, 0]}>
                    <meshStandardMaterial color="#111" metalness={1} />
                </Cylinder>
                <Box args={[0.2, 0.05, 0.3]} position={[0, -1, 0.05]}>
                    <meshStandardMaterial color="#000" />
                </Box>
            </group>
            <group position={[0.15, -0.4, 0]}>
                <Cylinder args={[0.02, 0.02, 1]} position={[0, -0.5, 0]}>
                    <meshStandardMaterial color="#111" metalness={1} />
                </Cylinder>
                <Box args={[0.2, 0.05, 0.3]} position={[0, -1, 0.05]}>
                    <meshStandardMaterial color="#000" />
                </Box>
            </group>
        </>
      )}

      {/* Light for dramatic effect */}
      <pointLight 
        intensity={visible ? 1.5 : 0} 
        color={details.color} 
        distance={4} 
        position={[0, 1, 1]} 
      />
    </group>
  );
}
