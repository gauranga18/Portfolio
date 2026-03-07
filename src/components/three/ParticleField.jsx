import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 250

const ParticleField = () => {
  const meshRef    = useRef()
  const { size }   = useThree()
  const mouseRef   = useRef({ x: 0, y: 0 })

  // Pre-compute positions, velocities, and colors
  const { positions, colors, phases } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors    = new Float32Array(PARTICLE_COUNT * 3)
    const phases    = new Float32Array(PARTICLE_COUNT)

    // Gold and green colors
    const gold  = new THREE.Color('#f0a500')
    const green = new THREE.Color('#2d6a4f')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 12
      positions[i3 + 2] = (Math.random() - 0.5) * 8

      const c = Math.random() > 0.6 ? gold : green
      colors[i3]     = c.r
      colors[i3 + 1] = c.g
      colors[i3 + 2] = c.b

      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, colors, phases }
  }, [])

  const geomRef = useRef()

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame(({ clock }) => {
    if (!geomRef.current) return
    const t = clock.getElapsedTime()
    const posAttr = geomRef.current.attributes.position

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3    = i * 3
      const phase = phases[i]

      // Gentle upward drift + horizontal sway
      posAttr.array[i3]     = positions[i3]     + Math.sin(t * 0.4 + phase) * 0.3 + mouseRef.current.x * 0.15
      posAttr.array[i3 + 1] = positions[i3 + 1] + Math.sin(t * 0.25 + phase) * 0.5 + mouseRef.current.y * 0.1
      posAttr.array[i3 + 2] = positions[i3 + 2] + Math.cos(t * 0.3 + phase) * 0.2
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions.slice()}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default ParticleField
