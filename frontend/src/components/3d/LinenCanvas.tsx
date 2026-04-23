import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function LinenFabric() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // Load fabric texture from URL
  const fabricTexture = useTexture('https://images.unsplash.com/photo-1528459105426-b9548367069b?q=80&w=664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') // Linen texture
  
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(4, 5, 64, 64)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = Math.sin(x * 1.2 + y * 0.8) * 0.18 + Math.cos(x * 0.6 + y * 1.4) * 0.12
      pos.setZ(i, z)
    }
    g.computeVertexNormals()
    return g
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.18
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.06 - 0.1
      const pos = meshRef.current.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = Math.sin(x * 1.2 + y * 0.8 + t * 0.5) * 0.18 + Math.cos(x * 0.6 + y * 1.4 + t * 0.4) * 0.12
        pos.setZ(i, z)
      }
      pos.needsUpdate = true
      meshRef.current.geometry.computeVertexNormals()
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} geometry={geometry} castShadow>
        <meshPhysicalMaterial
          map={fabricTexture}
          color="#ffffff"
          roughness={0.7}
          metalness={0.0}
          side={THREE.DoubleSide}
          thickness={0.5}
          transmission={0.08}
        />
      </mesh>
    </Float>
  )
}

function GlowOrb({ position, color }: { position: [number,number,number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.1)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.25} />
    </mesh>
  )
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={1.2} color="#F4EFE5" />
      <directionalLight position={[3, 5, 4]} intensity={2.5} color="#FFF8EC" castShadow />
      <directionalLight position={[-3, -2, 2]} intensity={0.8} color="#D4B895" />
      <pointLight position={[0, 3, 2]} intensity={1.2} color="#C4A962" />
      <LinenFabric />
      <GlowOrb position={[-2.5, 1.5, -1]} color="#C4A962" />
      <GlowOrb position={[2.5, -1, -1.5]} color="#8BA888" />
      <Environment preset="apartment" />
    </>
  )
}

export default function LinenHeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <HeroScene />
    </Canvas>
  )
}

/* ─── Product 3D Viewer (garment proxy) ─── */
function GarmentMesh() {
  const ref = useRef<THREE.Group>(null!)
  
  // Load garment textures from URLs
  const garmentTexture = useTexture('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format') // Fabric texture
  const collarTexture = useTexture('https://images.unsplash.com/photo-1584277261846-c6a1672ed5a3?w=500&auto=format') // Leather/collar texture
  
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.6
  })
  
  return (
    <group ref={ref}>
      {/* Torso */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 1.4, 32]} />
        <meshPhysicalMaterial 
          map={garmentTexture}
          roughness={0.4}
          metalness={0.1}
          color="#ffffff"
        />
      </mesh>
      
      {/* Left sleeve */}
      <mesh position={[-0.85, 0.35, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.9, 20]} />
        <meshPhysicalMaterial 
          map={garmentTexture}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* Right sleeve */}
      <mesh position={[0.85, 0.35, 0]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.9, 20]} />
        <meshPhysicalMaterial 
          map={garmentTexture}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <torusGeometry args={[0.22, 0.06, 12, 30]} />
        <meshPhysicalMaterial 
          map={collarTexture}
          roughness={0.3}
          color="#ffffff"
        />
      </mesh>
    </group>
  )
}

export function Product3DCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.4} color="#FFF8EC" />
      <directionalLight position={[3, 5, 4]} intensity={2} color="#FFF8EC" />
      <pointLight position={[-2, 2, 2]} intensity={0.8} color="#C4A962" />
      <GarmentMesh />
      <Environment preset="apartment" />
    </Canvas>
  )
}