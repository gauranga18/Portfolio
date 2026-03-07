import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const shapes = [
  { pos: [-4, 2, -2],  geo: 'torus',       args: [0.4, 0.15, 8, 24], color: '#c8860a', speed: 0.3 },
  { pos: [4, -1, -3],  geo: 'octahedron',  args: [0.5, 0],            color: '#2d6a4f', speed: 0.2 },
  { pos: [-3, -2, -1], geo: 'tetrahedron', args: [0.45, 0],           color: '#f0a500', speed: 0.4 },
  { pos: [3, 3, -4],   geo: 'icosahedron', args: [0.4, 0],            color: '#2d6a4f', speed: 0.15 },
]

const FloatingShape = ({ position, geoType, geoArgs, color, speed }) => {
  const ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * speed * 0.7
    ref.current.rotation.y = t * speed
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.3
  })

  const GeoTag = `${geoType}Geometry`

  return (
    <mesh ref={ref} position={position}>
      {geoType === 'torus' && <torusGeometry args={geoArgs} />}
      {geoType === 'octahedron' && <octahedronGeometry args={geoArgs} />}
      {geoType === 'tetrahedron' && <tetrahedronGeometry args={geoArgs} />}
      {geoType === 'icosahedron' && <icosahedronGeometry args={geoArgs} />}
      <meshStandardMaterial
        color={color}
        wireframe
        emissive={color}
        emissiveIntensity={0.25}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

const FloatingGeometry = () => (
  <group>
    {shapes.map((s, i) => (
      <FloatingShape
        key={i}
        position={s.pos}
        geoType={s.geo}
        geoArgs={s.args}
        color={s.color}
        speed={s.speed}
      />
    ))}
  </group>
)

export default FloatingGeometry
