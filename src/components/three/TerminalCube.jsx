import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── Y2K Palette (hardcoded so no CSS-var timing issues) ──────────────────────
const Y2K = {
  cyan:    new THREE.Color('#00ffff'),
  magenta: new THREE.Color('#ff00ff'),
  lime:    new THREE.Color('#39ff14'),
  hotPink: new THREE.Color('#ff69b4'),
  gold:    new THREE.Color('#ffd700'),
  chrome:  new THREE.Color('#e8e8ff'),
  orange:  new THREE.Color('#ff6600'),
  blue:    new THREE.Color('#0066ff'),
}

const cssCol = (v) =>
  new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(v).trim())

// ─── Glitching code lines ──────────────────────────────────────────────────────
const CODE_LINES = [
  '#include <stdio.h>',
  'malloc(0xDEADBEEF)',
  'int y2k = 1999;',
  'while(true) {',
  '  printf("\\aY2K\\a");',
  '  segfault();',
  '}',
  'return 0xCAFEBABE;',
]

// Glitch character pool
const GLITCH_CHARS = '█▓▒░╔╗╚╝║═☆★◆◇▲▼◀▶⚡✦'

const glitchify = (str, amount = 0.25) =>
  str.split('').map(ch =>
    Math.random() < amount
      ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      : ch
  ).join('')

// ─── 1. Orbiting Sphere with trail ───────────────────────────────────────────
const OrbitSphere = ({ radius, speed, angle0, size = 0.09, color = Y2K.gold, tilt = 0 }) => {
  const groupRef  = useRef()
  const sphereRef = useRef()
  const trailRef  = useRef()

  // Trail: 18 ghost positions
  const TRAIL = 18
  const trailBuf = useMemo(() => new Float32Array(TRAIL * 3), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + angle0

    const x = Math.cos(t) * radius
    const y = Math.sin(t * 0.7) * 0.45 + Math.sin(tilt + t * 0.3) * 0.2
    const z = Math.sin(t) * radius

    sphereRef.current.position.set(x, y, z)

    // Pulse scale
    const s = 1 + Math.sin(clock.getElapsedTime() * 5.5 + angle0) * 0.18
    sphereRef.current.scale.setScalar(s)

    // Shift trail buffer (push front, pop back)
    for (let i = TRAIL - 1; i > 0; i--) {
      trailBuf[i * 3]     = trailBuf[(i - 1) * 3]
      trailBuf[i * 3 + 1] = trailBuf[(i - 1) * 3 + 1]
      trailBuf[i * 3 + 2] = trailBuf[(i - 1) * 3 + 2]
    }
    trailBuf[0] = x; trailBuf[1] = y; trailBuf[2] = z

    if (trailRef.current) {
      trailRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Sphere head */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Additive glow halo */}
      <mesh ref={(m) => { if (m) m.position.copy(sphereRef.current?.position ?? new THREE.Vector3()) }}>
      </mesh>
      {/* Trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={trailBuf} count={TRAIL} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={size * 0.6}
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

// ─── 2. Orbital Ring (flat torus around the cube) ─────────────────────────────
const OrbitalRing = ({ radius, color, speed, tiltX = 0, tiltZ = 0, offset = 0 }) => {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset
    ref.current.rotation.y = t * speed
    ref.current.material.opacity = 0.15 + Math.sin(t * 2.4 + offset) * 0.07
  })
  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, 0.012, 3, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

// ─── 3. Glitching Code Text ───────────────────────────────────────────────────
const CodeText = ({ line, position, color, glitchRate = 0.08, delay = 0 }) => {
  const ref           = useRef()
  const [text, setText] = useState(line)
  const timerRef      = useRef(0)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()

    // Flicker opacity
    ref.current.fillOpacity = 0.45 + Math.sin(t * 3.2 + delay) * 0.25

    // Glitch text every ~0.9s
    timerRef.current += 0.016
    if (timerRef.current > 0.9 + delay * 0.2) {
      timerRef.current = 0
      if (Math.random() < 0.35) {
        setText(glitchify(line, glitchRate))
        setTimeout(() => setText(line), 80 + Math.random() * 120)
      }
    }

    // Horizontal glitch snap
    if (Math.sin(t * 13 + delay) > 0.96) {
      ref.current.position.x = position[0] + (Math.random() - 0.5) * 0.18
    } else {
      ref.current.position.x = position[0]
    }
  })

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.155}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.5}
      outlineWidth={0.004}
      outlineColor={color}
      outlineOpacity={0.3}
    >
      {text}
    </Text>
  )
}

// ─── 4. Chromatic Aberration Shell ────────────────────────────────────────────
const ChromaShell = ({ mainRef }) => {
  const rRef = useRef()
  const bRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const glitchActive = Math.sin(t * 7.3) > 0.92

    if (rRef.current) {
      rRef.current.position.x = glitchActive ? 0.06 + Math.random() * 0.04 : 0.018
      rRef.current.material.opacity = glitchActive ? 0.22 : 0.06 + Math.sin(t * 2) * 0.03
    }
    if (bRef.current) {
      bRef.current.position.x = glitchActive ? -0.06 - Math.random() * 0.04 : -0.018
      bRef.current.material.opacity = glitchActive ? 0.22 : 0.06 + Math.sin(t * 1.6) * 0.03
    }
  })

  return (
    <>
      <mesh ref={rRef} scale={1.005}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color={Y2K.magenta} wireframe transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={bRef} scale={1.005}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color={Y2K.cyan} wireframe transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  )
}

// ─── 5. Pulsing Energy Core ───────────────────────────────────────────────────
const EnergyCore = () => {
  const ref      = useRef()
  const glowRef  = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 0.22 + Math.sin(t * 4.5) * 0.06
    if (ref.current)     ref.current.scale.setScalar(pulse)
    if (glowRef.current) {
      glowRef.current.scale.setScalar(pulse * 2.2)
      glowRef.current.material.opacity = 0.04 + Math.sin(t * 4.5 + 0.3) * 0.025
    }
  })

  return (
    <group>
      <mesh ref={ref}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={Y2K.cyan}
          emissive={Y2K.cyan}
          emissiveIntensity={2.5}
          metalness={1}
          roughness={0}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={Y2K.cyan} transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

// ─── 6. Scanline ring ─────────────────────────────────────────────────────────
const ScanRing = () => {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Sweeps up and down the Y axis
    ref.current.position.y = Math.sin(t * 0.8) * 2.5
    ref.current.material.opacity = 0.12 + Math.sin(t * 5) * 0.06
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.4, 0.008, 3, 80]} />
      <meshBasicMaterial color={Y2K.lime} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
const TerminalCube = ({ mouseNorm = { x: 0, y: 0 } }) => {
  const mainRef  = useRef()
  const innerRef = useRef()

  // Text positions are stable (no Math.random in render)
  const textPositions = useMemo(() =>
    CODE_LINES.map((_, i) => [
      ((i % 3) - 1) * 0.9,
      1.55 - i * 0.46,
      (i % 2 === 0 ? 0.3 : -0.3),
    ]), []
  )

  const textColors = [
    Y2K.cyan, Y2K.magenta, Y2K.lime, Y2K.gold,
    Y2K.hotPink, Y2K.chrome, Y2K.orange, Y2K.blue,
  ]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    mainRef.current.rotation.y = t * 0.22
    mainRef.current.rotation.x = Math.sin(t * 0.28) * 0.1 + mouseNorm.y * -0.22
    mainRef.current.rotation.z = mouseNorm.x * 0.12 + Math.sin(t * 0.18) * 0.04

    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.38
      innerRef.current.rotation.x =  t * 0.27
      innerRef.current.rotation.z =  t * 0.15
    }
  })

  return (
    <group ref={mainRef}>

      {/* ── Neon lights ── */}
      <pointLight color={Y2K.cyan}    intensity={3}   distance={8}  decay={2} />
      <pointLight color={Y2K.magenta} intensity={2}   distance={6}  decay={2} position={[2, 2, 2]} />
      <pointLight color={Y2K.gold}    intensity={1.5} distance={5}  decay={2} position={[-2, -1, 1]} />
      <pointLight color={Y2K.lime}    intensity={1}   distance={4}  decay={2} position={[0, -3, 0]} />

      {/* ── Outer wireframe icosahedron (main cage) ── */}
      <mesh>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshPhysicalMaterial
          wireframe
          color={Y2K.gold}
          emissive={Y2K.gold}
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* ── Chromatic aberration ghost shells ── */}
      <ChromaShell />

      {/* ── Inner distorted sphere ── */}
      <mesh ref={innerRef} scale={0.82}>
        <icosahedronGeometry args={[1.4, 2]} />
        <MeshDistortMaterial
          color="#060612"
          wireframe
          distort={0.35}
          speed={3}
          emissive={Y2K.magenta}
          emissiveIntensity={0.7}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* ── Pulsing energy core ── */}
      <EnergyCore />

      {/* ── Scanline ring sweeping Y ── */}
      <ScanRing />

      {/* ── Orbital decorative rings ── */}
      <OrbitalRing radius={3.1} color={Y2K.cyan}    speed={ 0.18} tiltX={0.3}          offset={0}   />
      <OrbitalRing radius={3.4} color={Y2K.magenta} speed={-0.13} tiltX={1.1} tiltZ={0.4} offset={1} />
      <OrbitalRing radius={2.8} color={Y2K.lime}    speed={ 0.24} tiltX={0.6} tiltZ={1.0} offset={2} />

      {/* ── Orbiting spheres with trails ── */}
      <OrbitSphere radius={2.9} speed={0.50} angle0={0}              color={Y2K.gold}    size={0.10} tilt={0}   />
      <OrbitSphere radius={3.1} speed={0.33} angle0={Math.PI / 2}    color={Y2K.lime}    size={0.07} tilt={0.5} />
      <OrbitSphere radius={2.7} speed={0.66} angle0={Math.PI}        color={Y2K.magenta} size={0.06} tilt={1.0} />
      <OrbitSphere radius={3.3} speed={0.44} angle0={Math.PI * 1.5}  color={Y2K.hotPink} size={0.05} tilt={1.5} />
      <OrbitSphere radius={2.5} speed={0.28} angle0={Math.PI * 0.75} color={Y2K.chrome}  size={0.08} tilt={2.0} />

      {/* ── Glitching code text ── */}
      {CODE_LINES.map((line, i) => (
        <CodeText
          key={i}
          line={line}
          position={textPositions[i]}
          color={textColors[i % textColors.length]}
          glitchRate={0.06 + i * 0.012}
          delay={i * 0.18}
        />
      ))}

    </group>
  )
}

export default TerminalCube