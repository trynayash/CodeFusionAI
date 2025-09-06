import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cone, Text3D, Float, Center } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';

function AnimatedCube({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<Mesh>(null);
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Box ref={meshRef} position={position} args={[0.8, 0.8, 0.8]}>
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </Box>
    </Float>
  );
}

function AnimatedSphere({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere position={position} args={[0.6, 32, 32]}>
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </Sphere>
    </Float>
  );
}

function AnimatedCone({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.8}>
      <Cone position={position} args={[0.5, 1.2, 8]}>
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </Cone>
    </Float>
  );
}

export function Dashboard3D() {
  return (
    <div className="h-64 w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />
        
        {/* Floating 3D Elements */}
        <AnimatedCube position={[-2, 1, 0]} color="#3b82f6" />
        <AnimatedSphere position={[2, -1, 1]} color="#8b5cf6" />
        <AnimatedCone position={[0, 2, -1]} color="#06b6d4" />
        <AnimatedCube position={[3, 1, -2]} color="#10b981" />
        <AnimatedSphere position={[-3, -1, 1]} color="#f59e0b" />
        
        {/* Center Text */}
        <Center>
          <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.8}
              height={0.1}
              position={[0, 0, 0]}
            >
              CODE
              <meshStandardMaterial color="#ffffff" />
            </Text3D>
          </Float>
        </Center>
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}