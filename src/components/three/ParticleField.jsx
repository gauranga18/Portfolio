import { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Y2K Neon Palette (mirrors FloatingGeometry) ─────────────────────────────
const PALETTE = [
  new THREE.Color('#00ffff'), // cyan
  new THREE.Color('#ff00ff'), // magenta
  new THREE.Color('#39ff14'), // lime
  new THREE.Color('#ff69b4'), // hot pink
  new THREE.Color('#ffd700'), // gold
  new THREE.Color('#e8e8ff'), // chrome
  new THREE.Color('#ff6600'), // orange
  new THREE.Color('#0066ff'), // electric blue
]

const pick = () => PALETTE[Math.floor(Math.random() * PALETTE.length)]

// ─── Config ───────────────────────────────────────────────────────────────────
const STAR_COUNT    = 320   // ambient star dust
const GLITTER_COUNT = 60    // large pulsing glitter nodes
const STREAK_COUNT  = 12    // shooting star streaks
const CON_DIST      = 2.8   // max distance for connection lines
const CON_MAX       = 80    // max connection lines drawn per frame
const MOUSE_RADIUS  = 2.5   // repulsion bubble
const MOUSE_FORCE   = 0.55  // repulsion strength

// ─── 1. STAR DUST ─────────────────────────────────────────────────────────────
const StarDust = ({ mouseRef }) => {
  const geomRef = useRef()

  const { origins, phases, speeds, colorArr } = useMemo(() => {
    const origins  = new Float32Array(STAR_COUNT * 3)
    const phases   = new Float32Array(STAR_COUNT)
    const speeds   = new Float32Array(STAR_COUNT)
    const colorArr = new Float32Array(STAR_COUNT * 3)

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3
      origins[i3]     = (Math.random() - 0.5) * 24
      origins[i3 + 1] = (Math.random() - 0.5) * 14
      origins[i3 + 2] = (Math.random() - 0.5) * 10 - 2
      phases[i]  = Math.random() * Math.PI * 2
      speeds[i]  = 0.18 + Math.random() * 0.32

      const c = pick()
      colorArr[i3]     = c.r
      colorArr[i3 + 1] = c.g
      colorArr[i3 + 2] = c.b
    }
    return { origins, phases, speeds, colorArr }
  }, [])

  useFrame(({ clock }) => {
    if (!geomRef.current) return
    const t      = clock.getElapsedTime()
    const posArr = geomRef.current.attributes.position.array
    const mx     = mouseRef.current.x
    const my     = mouseRef.current.y

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3
      const ph = phases[i]
      const sp = speeds[i]

      let px = origins[i3]     + Math.sin(t * sp * 0.7 + ph)        * 0.35
      let py = origins[i3 + 1] + Math.sin(t * sp * 0.5 + ph + 1.2)  * 0.45
      const pz = origins[i3 + 2] + Math.cos(t * sp * 0.4 + ph)      * 0.2

      // Mouse repulsion
      const dx = px - mx * 8
      const dy = py - my * 5
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_RADIUS) {
        const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE
        px += (dx / dist) * force
        py += (dy / dist) * force
      }

      posArr[i3]     = px
      posArr[i3 + 1] = py
      posArr[i3 + 2] = pz
    }
    geomRef.current.attributes.position.needsUpdate = true
  })

  const initPos = useMemo(() => origins.slice(), [origins])

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" array={initPos}   count={STAR_COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colorArr}  count={STAR_COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── 2. GLITTER NODES (large, pulsing, iridescent) ───────────────────────────
const GlitterNodes = ({ mouseRef }) => {
  const geomRef = useRef()
  const matRef  = useRef()

  const { origins, phases, speeds, colorArr, sizeMult } = useMemo(() => {
    const origins  = new Float32Array(GLITTER_COUNT * 3)
    const phases   = new Float32Array(GLITTER_COUNT)
    const speeds   = new Float32Array(GLITTER_COUNT)
    const colorArr = new Float32Array(GLITTER_COUNT * 3)
    const sizeMult = new Float32Array(GLITTER_COUNT)

    for (let i = 0; i < GLITTER_COUNT; i++) {
      const i3 = i * 3
      origins[i3]     = (Math.random() - 0.5) * 20
      origins[i3 + 1] = (Math.random() - 0.5) * 12
      origins[i3 + 2] = (Math.random() - 0.5) * 6
      phases[i]   = Math.random() * Math.PI * 2
      speeds[i]   = 0.12 + Math.random() * 0.22
      sizeMult[i] = 0.5 + Math.random() * 1.0

      const c = pick()
      colorArr[i3]     = c.r
      colorArr[i3 + 1] = c.g
      colorArr[i3 + 2] = c.b
    }
    return { origins, phases, speeds, colorArr, sizeMult }
  }, [])

  useFrame(({ clock }) => {
    if (!geomRef.current) return
    const t      = clock.getElapsedTime()
    const posArr = geomRef.current.attributes.position.array
    const mx     = mouseRef.current.x
    const my     = mouseRef.current.y

    for (let i = 0; i < GLITTER_COUNT; i++) {
      const i3 = i * 3
      const ph = phases[i]
      const sp = speeds[i]

      let px = origins[i3]     + Math.sin(t * sp + ph)       * 0.5
      let py = origins[i3 + 1] + Math.cos(t * sp * 0.7 + ph) * 0.6

      const dx   = px - mx * 8
      const dy   = py - my * 5
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_RADIUS * 1.4) {
        const force = (1 - dist / (MOUSE_RADIUS * 1.4)) * MOUSE_FORCE * 1.6
        px += (dx / dist) * force
        py += (dy / dist) * force
      }

      posArr[i3]     = px
      posArr[i3 + 1] = py
      posArr[i3 + 2] = origins[i3 + 2]
    }
    geomRef.current.attributes.position.needsUpdate = true

    // Global flicker on the material
    if (matRef.current) {
      matRef.current.opacity    = 0.55 + Math.sin(t * 6.3) * 0.25
      matRef.current.size       = 0.14 + Math.sin(t * 2.1) * 0.04
    }
  })

  const initPos = useMemo(() => origins.slice(), [origins])

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" array={initPos}  count={GLITTER_COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colorArr} count={GLITTER_COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.14}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── 3. CONNECTION WEB ────────────────────────────────────────────────────────
const ConnectionWeb = ({ mouseRef }) => {
  const lineRef = useRef()

  const { nodeOrigins, nodePhases, nodeSpeeds } = useMemo(() => {
    const NODE_COUNT  = 55
    const nodeOrigins = new Float32Array(NODE_COUNT * 3)
    const nodePhases  = new Float32Array(NODE_COUNT)
    const nodeSpeeds  = new Float32Array(NODE_COUNT)

    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3
      nodeOrigins[i3]     = (Math.random() - 0.5) * 20
      nodeOrigins[i3 + 1] = (Math.random() - 0.5) * 12
      nodeOrigins[i3 + 2] = (Math.random() - 0.5) * 4 - 1
      nodePhases[i] = Math.random() * Math.PI * 2
      nodeSpeeds[i] = 0.1 + Math.random() * 0.2
    }
    return { nodeOrigins, nodePhases, nodeSpeeds }
  }, [])

  // Pre-allocate max vertex buffer for lines (pairs of points)
  const maxVerts   = CON_MAX * 2
  const lineGeoRef = useRef()
  const lineBuf    = useMemo(() => new Float32Array(maxVerts * 3), [])
  const colorBuf   = useMemo(() => new Float32Array(maxVerts * 3), [])

  const NODE_COUNT = nodeOrigins.length / 3
  const nodePos    = useMemo(() => new Float32Array(NODE_COUNT * 3), [NODE_COUNT])

  useFrame(({ clock }) => {
    if (!lineGeoRef.current) return
    const t  = clock.getElapsedTime()
    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    // Update node positions
    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3
      const ph = nodePhases[i]
      const sp = nodeSpeeds[i]
      nodePos[i3]     = nodeOrigins[i3]     + Math.sin(t * sp + ph)       * 0.4 + mx * 0.3
      nodePos[i3 + 1] = nodeOrigins[i3 + 1] + Math.cos(t * sp * 0.7 + ph) * 0.5 + my * 0.2
      nodePos[i3 + 2] = nodeOrigins[i3 + 2]
    }

    // Build connection segments
    let lineIdx = 0
    outer: for (let a = 0; a < NODE_COUNT - 1; a++) {
      for (let b = a + 1; b < NODE_COUNT; b++) {
        if (lineIdx >= CON_MAX) break outer
        const ax = nodePos[a * 3], ay = nodePos[a * 3 + 1], az = nodePos[a * 3 + 2]
        const bx = nodePos[b * 3], by = nodePos[b * 3 + 1], bz = nodePos[b * 3 + 2]
        const dx = ax - bx, dy = ay - by, dz = az - bz
        const d  = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (d < CON_DIST) {
          const fade  = 1 - d / CON_DIST
          const pulse = (Math.sin(t * 3 + a * 0.7 + b * 0.3) * 0.5 + 0.5) * fade
          const vi    = lineIdx * 6
          // Point A
          lineBuf[vi]     = ax; lineBuf[vi + 1] = ay; lineBuf[vi + 2] = az
          // Point B
          lineBuf[vi + 3] = bx; lineBuf[vi + 4] = by; lineBuf[vi + 5] = bz
          // Color — alternate cyan / magenta per pair
          const r = lineIdx % 3 === 0 ? 0.0  : lineIdx % 3 === 1 ? 1.0 : 0.22
          const g = lineIdx % 3 === 0 ? 1.0  : lineIdx % 3 === 1 ? 0.0 : 1.0
          const bb2 = lineIdx % 3 === 0 ? 1.0 : lineIdx % 3 === 1 ? 1.0 : 0.08
          colorBuf[vi]     = r * pulse; colorBuf[vi + 1] = g * pulse; colorBuf[vi + 2] = bb2 * pulse
          colorBuf[vi + 3] = r * pulse; colorBuf[vi + 4] = g * pulse; colorBuf[vi + 5] = bb2 * pulse
          lineIdx++
        }
      }
    }

    // Zero out unused slots
    const used = lineIdx * 6
    lineBuf.fill(0, used)
    colorBuf.fill(0, used)

    lineGeoRef.current.attributes.position.needsUpdate = true
    lineGeoRef.current.attributes.color.needsUpdate    = true
  })

  return (
    <lineSegments>
      <bufferGeometry ref={lineGeoRef}>
        <bufferAttribute attach="attributes-position" array={lineBuf}  count={maxVerts} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colorBuf} count={maxVerts} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// ─── 4. SHOOTING STARS ────────────────────────────────────────────────────────
const ShootingStars = () => {
  const geomRef = useRef()
  const matRef  = useRef()

  const { streakData, colorArr } = useMemo(() => {
    // Each streak = head + N tail points → we use 8 vertices per streak
    const TAIL     = 8
    const total    = STREAK_COUNT * TAIL
    const positions = new Float32Array(total * 3)
    const colorArr  = new Float32Array(total * 3)
    const streakData = Array.from({ length: STREAK_COUNT }, (_, i) => ({
      ox:    (Math.random() - 0.5) * 28,
      oy:    (Math.random() - 0.5) * 16,
      oz:    -Math.random() * 6 - 2,
      vx:    (Math.random() - 0.5) * 4,
      vy:    (Math.random() - 0.5) * 2 - 0.5,
      phase: (i / STREAK_COUNT) * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.2,
      color: pick(),
      tail:  TAIL,
    }))
    return { streakData, colorArr, positions, TAIL, total }
  }, [])

  const TAIL    = 8
  const posBuf  = useMemo(() => new Float32Array(STREAK_COUNT * TAIL * 3), [])

  useFrame(({ clock }) => {
    if (!geomRef.current) return
    const t = clock.getElapsedTime()

    for (let s = 0; s < STREAK_COUNT; s++) {
      const sd  = streakData[s]
      const cyc = ((t * sd.speed + sd.phase) % (Math.PI * 2))
      const life = cyc / (Math.PI * 2)

      // Head position — streak moves in vx/vy direction over its lifetime
      const hx = sd.ox + sd.vx * life * 6
      const hy = sd.oy + sd.vy * life * 6
      const hz = sd.oz

      for (let j = 0; j < TAIL; j++) {
        const frac  = j / TAIL
        const idx   = (s * TAIL + j) * 3
        const fade  = life < 0.05 ? life / 0.05 : life > 0.85 ? (1 - life) / 0.15 : 1
        const alpha = (1 - frac) * fade

        // Tail trails behind head
        posBuf[idx]     = hx - sd.vx * frac * 1.2
        posBuf[idx + 1] = hy - sd.vy * frac * 1.2
        posBuf[idx + 2] = hz

        colorArr[(s * TAIL + j) * 3]     = sd.color.r * alpha
        colorArr[(s * TAIL + j) * 3 + 1] = sd.color.g * alpha
        colorArr[(s * TAIL + j) * 3 + 2] = sd.color.b * alpha
      }
    }

    geomRef.current.attributes.position.needsUpdate = true
    geomRef.current.attributes.color.needsUpdate    = true
  })

  const total = STREAK_COUNT * TAIL

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" array={posBuf}  count={total} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colorArr} count={total} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.09}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── 5. CURSOR HALO ───────────────────────────────────────────────────────────
const CursorHalo = ({ mouseRef }) => {
  const meshRef = useRef()
  const ringRef = useRef()

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime()
    const tx = mouseRef.current.x * 8
    const ty = mouseRef.current.y * 5

    if (meshRef.current) {
      meshRef.current.position.x = tx
      meshRef.current.position.y = ty
      meshRef.current.material.opacity = 0.08 + Math.sin(t * 4.2) * 0.04
      meshRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08)
    }
    if (ringRef.current) {
      ringRef.current.position.x = tx
      ringRef.current.position.y = ty
      ringRef.current.rotation.z = t * 0.8
      ringRef.current.material.opacity = 0.25 + Math.sin(t * 2.8) * 0.1
    }
  })

  return (
    <group>
      {/* Soft glow disc */}
      <mesh ref={meshRef} position={[0, 0, 1]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Spinning ring */}
      <mesh ref={ringRef} position={[0, 0, 1]}>
        <torusGeometry args={[0.62, 0.015, 4, 48]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
const ParticleField = () => {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <group>
      <StarDust      mouseRef={mouseRef} />
      <GlitterNodes  mouseRef={mouseRef} />
      <ConnectionWeb mouseRef={mouseRef} />
      <ShootingStars />
      <CursorHalo    mouseRef={mouseRef} />
    </group>
  )
}

export default ParticleField