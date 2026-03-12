import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Y2K Neon + Chrome Palette ───────────────────────────────────────────────
const Y2K = {
  cyan:     '#00ffff',
  magenta:  '#ff00ff',
  lime:     '#39ff14',
  hotPink:  '#ff69b4',
  gold:     '#ffd700',
  chrome:   '#e8e8ff',
  orange:   '#ff6600',
  blue:     '#0066ff',
}

// ─── Single Shape ─────────────────────────────────────────────────────────────
const FloatingShape = ({ position, geoType, geoArgs, color, speed, phase = 0 }) => {
  const groupRef  = useRef()
  const solidRef  = useRef()
  const glowRef   = useRef()

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime()
    const tp = t + phase

    // Rotation
    groupRef.current.rotation.x = tp * speed * 0.7
    groupRef.current.rotation.y = tp * speed
    groupRef.current.rotation.z = tp * speed * 0.25

    // Float + lateral drift
    groupRef.current.position.y = position[1] + Math.sin(tp * 0.5 + position[0]) * 0.45
    groupRef.current.position.x = position[0] + Math.cos(tp * 0.28 + position[2]) * 0.18

    // Pulse scale
    const pulse = 1 + Math.sin(tp * 2.8) * 0.07
    groupRef.current.scale.setScalar(pulse)

    // Glitch snap – rare positional jitter
    if (Math.sin(tp * 11.3) > 0.985) {
      groupRef.current.position.x += (Math.random() - 0.5) * 0.14
      groupRef.current.position.y += (Math.random() - 0.5) * 0.08
    }

    // Emissive breathe on solid mesh
    if (solidRef.current?.material) {
      solidRef.current.material.emissiveIntensity = 0.35 + Math.sin(tp * 3.1) * 0.2
    }

    // Glow shell opacity pulse
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = 0.04 + Math.sin(tp * 1.8) * 0.025
    }
  })

  const Geo = () => {
    switch (geoType) {
      case 'torus':        return <torusGeometry args={geoArgs} />
      case 'octahedron':   return <octahedronGeometry args={geoArgs} />
      case 'tetrahedron':  return <tetrahedronGeometry args={geoArgs} />
      case 'icosahedron':  return <icosahedronGeometry args={geoArgs} />
      case 'dodecahedron': return <dodecahedronGeometry args={geoArgs} />
      case 'torusKnot':    return <torusKnotGeometry args={geoArgs} />
      case 'cone':         return <coneGeometry args={geoArgs} />
      default:             return <octahedronGeometry args={geoArgs} />
    }
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Holographic solid – MeshPhysicalMaterial with iridescence */}
      <mesh ref={solidRef}>
        <Geo />
        <meshPhysicalMaterial
          color={color}
          metalness={0.95}
          roughness={0.04}
          iridescence={1}
          iridescenceIOR={2.4}
          iridescenceThicknessRange={[150, 900]}
          transparent
          opacity={0.88}
          emissive={color}
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe overlay – crisp neon cage */}
      <mesh>
        <Geo />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.45} />
      </mesh>

      {/* Outer glow shell – backface bloom proxy */}
      <mesh ref={glowRef} scale={1.35}>
        <Geo />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// ─── Neon Particle Field ──────────────────────────────────────────────────────
const ParticleField = () => {
  const pointsRef = useRef()

  const { positions, colors } = useMemo(() => {
    const count     = 280
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const palette   = Object.values(Y2K).map(hex => new THREE.Color(hex))

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5

      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    pointsRef.current.rotation.y = t * 0.018
    pointsRef.current.rotation.z = Math.sin(t * 0.12) * 0.03
    // Twinkle: size pulsed via material
    pointsRef.current.material.size = 0.035 + Math.sin(t * 4) * 0.008
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.038} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

// ─── Spinning Orbital Ring ────────────────────────────────────────────────────
const OrbitalRing = ({ radius, tubeRadius = 0.007, color, speed, axis = 'y', offset = 0 }) => {
  const ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset
    ref.current.rotation[axis] = t * speed
    ref.current.material.opacity = 0.18 + Math.sin(t * 1.6 + offset) * 0.08
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tubeRadius, 3, 160]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  )
}

// ─── Scan-Line Grid Plane ─────────────────────────────────────────────────────
const NeonGrid = () => {
  const linesRef = useRef()
  const scanRef  = useRef()

  const gridGeo = useMemo(() => {
    const geo   = new THREE.BufferGeometry()
    const verts = []
    const size  = 24
    const divs  = 24
    const step  = size / divs

    for (let i = 0; i <= divs; i++) {
      const v = -size / 2 + i * step
      verts.push(v, -size / 2, 0, v, size / 2, 0)
      verts.push(-size / 2, v, 0, size / 2, v, 0)
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return geo
  }, [])

  // Build a THREE.Line as a primitive so R3F doesn't need to resolve `line_`
  const scanLine = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-12, 0, 0, 12, 0, 0], 3))
    const mat = new THREE.LineBasicMaterial({ color: Y2K.cyan, transparent: true, opacity: 0.6 })
    return new THREE.Line(geo, mat)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (linesRef.current?.material) {
      linesRef.current.material.opacity = 0.055 + Math.sin(t * 0.4) * 0.02
    }
    if (scanRef.current) {
      scanRef.current.position.y = -6 + ((t * 1.2) % 12)
      scanRef.current.material.opacity = 0.5 + Math.sin(t * 8) * 0.3
    }
  })

  return (
    <group position={[0, 0, -7]}>
      <lineSegments ref={linesRef} geometry={gridGeo}>
        <lineBasicMaterial color={Y2K.cyan} transparent opacity={0.06} />
      </lineSegments>
      <primitive ref={scanRef} object={scanLine} />
    </group>
  )
}

// ─── Chromatic Aberration Duplicate (ghost offset mesh) ──────────────────────
const GhostLayer = ({ shapes }) => (
  <group position={[0.015, -0.01, 0]} rotation={[0, 0, 0.004]}>
    {shapes.slice(0, 4).map((s, i) => (
      <FloatingShape
        key={i}
        position={s.pos}
        geoType={s.geo}
        geoArgs={s.args}
        color={i % 2 === 0 ? Y2K.cyan : Y2K.magenta}
        speed={s.speed * 1.002}
        phase={s.phase + 0.05}
      />
    ))}
  </group>
)

// ─── Root Export ──────────────────────────────────────────────────────────────
const FloatingGeometry = () => {
  const shapes = useMemo(() => [
    // Core shapes (enhanced originals)
    { pos: [-4,  2,  -2], geo: 'torus',        args: [0.52, 0.18, 12, 48],      color: Y2K.gold,    speed: 0.30, phase: 0 },
    { pos: [ 4, -1,  -3], geo: 'octahedron',   args: [0.56, 0],                 color: Y2K.lime,    speed: 0.20, phase: 1 },
    { pos: [-3, -2,  -1], geo: 'tetrahedron',  args: [0.50, 0],                 color: Y2K.magenta, speed: 0.40, phase: 2 },
    { pos: [ 3,  3,  -4], geo: 'icosahedron',  args: [0.46, 1],                 color: Y2K.cyan,    speed: 0.15, phase: 3 },
    // New Y2K additions
    { pos: [ 1, -3,  -2], geo: 'dodecahedron', args: [0.40, 0],                 color: Y2K.hotPink, speed: 0.25, phase: 4 },
    { pos: [-2,  1,  -3], geo: 'torusKnot',    args: [0.28, 0.09, 80, 16, 2, 3],color: Y2K.chrome, speed: 0.18, phase: 5 },
    { pos: [ 5,  0.5,-2], geo: 'cone',         args: [0.30, 0.70, 6],           color: Y2K.orange,  speed: 0.35, phase: 6 },
    { pos: [-5, -1,  -4], geo: 'icosahedron',  args: [0.36, 0],                 color: Y2K.blue,    speed: 0.22, phase: 7 },
    { pos: [ 0,  4,  -5], geo: 'torus',        args: [0.38, 0.12, 8, 36],       color: Y2K.magenta, speed: 0.28, phase: 8 },
    { pos: [-1, -4,  -3], geo: 'octahedron',   args: [0.44, 0],                 color: Y2K.gold,    speed: 0.32, phase: 9 },
  ], [])

  return (
    <group>
      {/* ── Lighting – neon coloured point lights ── */}
      <ambientLight intensity={0.08} />
      <pointLight position={[ 6,  5,  4]} color={Y2K.cyan}    intensity={3}   distance={18} decay={2} />
      <pointLight position={[-6, -5,  3]} color={Y2K.magenta} intensity={3}   distance={18} decay={2} />
      <pointLight position={[ 0,  4,  3]} color={Y2K.gold}    intensity={2}   distance={12} decay={2} />
      <pointLight position={[ 3, -3,  5]} color={Y2K.lime}    intensity={1.5} distance={10} decay={2} />
      <pointLight position={[-3,  2,  5]} color={Y2K.hotPink} intensity={1.5} distance={10} decay={2} />

      {/* ── Background: grid + scan line ── */}
      <NeonGrid />

      {/* ── Orbital decorative rings ── */}
      <OrbitalRing radius={3.2} color={Y2K.cyan}    speed={ 0.14} axis="y" offset={0}   />
      <OrbitalRing radius={4.5} color={Y2K.magenta} speed={-0.09} axis="x" offset={1.5} />
      <OrbitalRing radius={5.8} color={Y2K.lime}    speed={ 0.07} axis="z" offset={3}   />
      <OrbitalRing radius={2.4} color={Y2K.gold}    speed={-0.18} axis="y" offset={0.8} tubeRadius={0.005} />

      {/* ── Particle field ── */}
      <ParticleField />

      {/* ── Chromatic aberration ghost layer ── */}
      <GhostLayer shapes={shapes} />

      {/* ── Main floating shapes ── */}
      {shapes.map((s, i) => (
        <FloatingShape
          key={i}
          position={s.pos}
          geoType={s.geo}
          geoArgs={s.args}
          color={s.color}
          speed={s.speed}
          phase={s.phase}
        />
      ))}
    </group>
  )
}

export default FloatingGeometry