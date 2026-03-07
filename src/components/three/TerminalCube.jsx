import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Orbiting small sphere
const OrbitSphere = ({ radius, speed, angle0, size = 0.08, color = '#c8860a' }) => {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + angle0
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.7) * 0.4,
      Math.sin(t) * radius,
    )
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.3} />
    </mesh>
  )
}

const TerminalCube = ({ mouseNorm = { x: 0, y: 0 } }) => {
  const mainRef  = useRef()
  const innerRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    mainRef.current.rotation.y  = t * 0.25
    mainRef.current.rotation.x  = Math.sin(t * 0.3) * 0.12 + mouseNorm.y * -0.2
    mainRef.current.rotation.z  = mouseNorm.x * 0.1

    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.4
      innerRef.current.rotation.x =  t * 0.3
    }
  })

  const codeLines = [
    '#include <stdio.h>',
    'int main() {',
    '  malloc(256);',
    '  return 0;',
    '}',
  ]

  return (
    <group ref={mainRef}>
      {/* Outer wireframe icosahedron */}
      <mesh>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial
          wireframe
          color="#c8860a"
          emissive="#c8860a"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Inner distorted sphere */}
      <mesh ref={innerRef} scale={0.85}>
        <icosahedronGeometry args={[1.4, 2]} />
        <MeshDistortMaterial
          color="#0a1a0d"
          wireframe
          distort={0.2}
          speed={2}
          emissive="#2d6a4f"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Floating code text lines */}
      {codeLines.map((line, i) => (
        <Text
          key={i}
          position={[
            (Math.random() - 0.5) * 2.5,
            1.2 - i * 0.55,
            (Math.random() - 0.5) * 1.5,
          ]}
          fontSize={0.18}
          color="#f0a500"
          anchorX="center"
          anchorY="middle"
          font={undefined}
          fillOpacity={0.55}
        >
          {line}
        </Text>
      ))}

      {/* Orbiting spheres */}
      <OrbitSphere radius={2.8} speed={0.5}  angle0={0}           color="#c8860a" />
      <OrbitSphere radius={3.0} speed={0.35} angle0={Math.PI / 2} color="#2d6a4f" size={0.06} />
      <OrbitSphere radius={2.6} speed={0.65} angle0={Math.PI}     color="#f0a500" size={0.05} />

      {/* Point light from inside for glow */}
      <pointLight color="#c8860a" intensity={1.5} distance={6} />
    </group>
  )
}

export default TerminalCube
