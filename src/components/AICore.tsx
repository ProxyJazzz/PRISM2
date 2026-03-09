import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Core() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x += delta * 0.2;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z -= delta * 0.1;
      ringsRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Central Node */}
      <Sphere ref={coreRef} args={[1, 32, 32]}>
        <meshStandardMaterial 
          color="#3B82F6" 
          emissive="#60A5FA" 
          emissiveIntensity={2} 
          wireframe 
        />
      </Sphere>

      {/* Orbiting Rings */}
      <group ref={ringsRef}>
        <Torus args={[2, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#60A5FA" transparent opacity={0.5} />
        </Torus>
        <Torus args={[2.5, 0.01, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.3} />
        </Torus>
        <Torus args={[3, 0.05, 16, 100]} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <meshStandardMaterial color="#0A192F" emissive="#3B82F6" emissiveIntensity={1} wireframe />
        </Torus>
      </group>
    </group>
  );
}

function DataParticles() {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#60A5FA"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function AICore() {
  return (
    <div className="w-full h-[400px] md:h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#60A5FA" />
        <Core />
        <DataParticles />
      </Canvas>
    </div>
  );
}
