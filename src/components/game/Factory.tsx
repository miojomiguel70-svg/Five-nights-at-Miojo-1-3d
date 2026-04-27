import { Box, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export default function Factory() {
  return (
    <group position={[0, 0, -15]}>
      {/* Store Floor */}
      <Plane args={[60, 60]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
      </Plane>

      {/* Ceiling */}
      <Plane args={[60, 60]} rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <meshStandardMaterial color="#080808" />
      </Plane>

      {/* Walls */}
      <Box args={[60, 10, 1]} position={[0, 4, -30]}> {/* Back Wall */}
        <meshStandardMaterial color="#111" />
      </Box>
      <Box args={[1, 10, 60]} position={[-30, 4, 0]}> {/* Left Wall */}
        <meshStandardMaterial color="#111" />
      </Box>
      <Box args={[1, 10, 60]} position={[30, 4, 0]}> {/* Right Wall */}
        <meshStandardMaterial color="#111" />
      </Box>

      {/* Ceiling Lights (Flickering Grid) */}
      {[...Array(9)].map((_, i) => (
        <group key={`light-${i}`} position={[(i % 3 - 1) * 15, 7.8, (Math.floor(i / 3) - 1) * 15]}>
            <Box args={[2, 0.1, 4]}>
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.6} />
            </Box>
            <pointLight intensity={0.2} color="white" distance={15} />
        </group>
      ))}

      {/* Multiple Store Aisles (Prateleiras) */}
      {[...Array(6)].map((_, i) => (
        <group key={`aisle-${i}`} position={[(i % 3 - 1) * 10, 1.5, (Math.floor(i / 3) - 0.5) * 12]}>
            {/* Shelf Frame */}
            <Box args={[4, 3, 10]}>
                <meshStandardMaterial color="#111" />
            </Box>
            {/* Products (Rows of boxes) */}
            {[...Array(3)].map((_, floor) => (
                <group key={`floor-${floor}`} position={[0, floor * 0.8 - 0.8, 0]}>
                    {[-1.8, 1.8].map((xSide) => (
                        <group key={`side-${xSide}`} position={[xSide, 0, 0]}>
                            {[...Array(6)].map((_, item) => (
                                <Box key={`item-${item}`} args={[0.3, 0.4, 0.4]} position={[0, 0, (item * 1.5) - 3.75]}>
                                    <meshStandardMaterial color={['red', 'yellow', 'blue', 'green', 'orange'][ (i + item + floor) % 5]} />
                                </Box>
                            ))}
                        </group>
                    ))}
                </group>
            ))}
        </group>
      ))}

      {/* Refrigerators Row */}
      <group position={[25, 2, -10]}>
         {[...Array(4)].map((_, i) => (
            <group key={`fridge-${i}`} position={[0, 0, (i * 4) - 6]}>
                <Box args={[1, 4, 3.5]}>
                    <meshStandardMaterial color="#1a1a1a" />
                </Box>
                {/* Fridge Glass with glow */}
                <Box args={[0.1, 3.8, 3.3]} position={[-0.46, 0, 0]}>
                    <meshStandardMaterial color="#44ddff" emissive="#44ddff" emissiveIntensity={0.4} transparent opacity={0.3} />
                </Box>
                {/* Items inside fridges */}
                <group position={[-0.2, 0, 0]}>
                    {[...Array(8)].map((_, bottle) => (
                        <Cylinder key={`bottle-${bottle}`} args={[0.1, 0.1, 0.6]} position={[0, (Math.floor(bottle/2) * 0.8) - 1.2, (bottle%2 * 1) - 0.5]}>
                             <meshStandardMaterial color={bottle % 2 === 0 ? "orange" : "blue"} />
                        </Cylinder>
                    ))}
                </group>
            </group>
         ))}
      </group>

      {/* Checkout Counter */}
      <group position={[15, 0.75, 10]}>
          <Box args={[8, 1.5, 4]}>
              <meshStandardMaterial color="#222" />
          </Box>
          <Box args={[1.2, 1, 0.8]} position={[1, 1, 0.5]}>
              <meshStandardMaterial color="#000" />
          </Box>
          <Box args={[0.1, 0.8, 0.6]} position={[1, 1.2, 0.5]} rotation={[0, -0.3, 0]}>
              <meshStandardMaterial color="#222" emissive="#00ff00" emissiveIntensity={0.2} />
          </Box>
      </group>

      {/* Back Room Storage Door Area */}
      <group position={[0, 4, -29]}>
          {/* Large Storage Entrance */}
          <Box args={[6, 8, 0.5]}>
              <meshStandardMaterial color="#000" />
          </Box>
          <pointLight intensity={0.4} color="red" distance={12} position={[0, 2, 2]} />
      </group>

      {/* Abandoned Shopping Carts */}
      <group position={[-20, 0.5, 5]} rotation={[0, 0.4, 0]}>
          <Box args={[2, 1.2, 3]}>
              <meshStandardMaterial color="#888" wireframe transparent opacity={0.5} />
          </Box>
      </group>

      {/* Aisle Signs */}
      {[...Array(2)].map((_, i) => (
        <group key={i} position={[i === 0 ? -5 : 5, 5, -5]}>
            <Box args={[2, 0.6, 0.1]}>
                <meshStandardMaterial color="#111" />
            </Box>
            <Box args={[1.8, 0.4, 0.11]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#fff" emissive={i === 0 ? "#fbbf24" : "#60a5fa"} emissiveIntensity={0.2} />
            </Box>
        </group>
      ))}

      {/* Checkout Area Details */}
      <group position={[15, 1.6, 10]}>
          <group position={[0, 0, 0]} rotation={[0, -0.5, 0]}>
              <Box args={[0.4, 0.3, 0.1]}>
                  <meshStandardMaterial color="#222" />
              </Box>
              <Box args={[0.35, 0.25, 0.01]} position={[0, 0, 0.051]}>
                  <meshStandardMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={2} />
              </Box>
          </group>
      </group>
    </group>
  );
}
