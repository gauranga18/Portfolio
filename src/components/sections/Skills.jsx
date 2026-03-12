import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Text, Billboard } from '@react-three/drei'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import * as THREE from 'three'
import SectionTitle from '../ui/SectionTitle'
import './Skills.css'

// ─── Planet data ──────────────────────────────────────────────────────────────
const SOLAR_SKILLS = [
  {
    name: 'Linux',
    sub: 'Systems & Kernel',
    color: '#F4D03F',       // yellow
    emissive: '#B7950B',
    size: 0.44
  },
  {
    name: 'C',
    sub: 'Low-level Systems',
    color: '#3498DB',       // blue
    emissive: '#1B4F72',
    size: 0.37
  },
  {
    name: 'Docker',
    sub: 'Containerization',
    color: '#1ABC9C',       // teal
    emissive: '#0E6655',
    size: 0.41
  },
  {
    name: 'Git',
    sub: 'Version Control',
    color: '#E74C3C',       // red
    emissive: '#7B241C',
    size: 0.39
  },
  {
    name: 'YAML',
    sub: 'Configuration',
    color: '#9B59B6',       // purple
    emissive: '#512E5F',
    size: 0.34
  },
  {
    name: 'Java',
    sub: 'Backend & OOP',
    color: '#E67E22',       // orange
    emissive: '#6E2C00',
    size: 0.41
  },
]

const ORBIT_R = 4.6   // orbit radius
const N       = SOLAR_SKILLS.length
const TWO_PI  = Math.PI * 2
// Initial group rotation so planet 0 faces camera (positive Z) at scroll = 0
// Camera at +Z → front = angle π/2. Planet 0 at local angle 0 → needs group.y = π/2
const INIT_ROT = Math.PI / 2

// ─── Sun ──────────────────────────────────────────────────────────────────────
const Sun = () => {
  const coreRef  = useRef()
  const halo1Ref = useRef()
  const halo2Ref = useRef()
  const halo3Ref = useRef()

  // shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // update shader time
    uniforms.uTime.value = t

    // core pulse
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.035)
    }

    // halo breathing
    if (halo1Ref.current) halo1Ref.current.material.opacity = 0.16 + Math.sin(t * 1.5) * 0.06
    if (halo2Ref.current) halo2Ref.current.material.opacity = 0.07 + Math.sin(t * 1.1 + 1.0) * 0.03
    if (halo3Ref.current) halo3Ref.current.material.opacity = 0.03 + Math.sin(t * 0.8 + 2.1) * 0.015
  })

  return (
    <group>
      {/* STAR CORE */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.72, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vNormal;

            void main() {
              vUv = uv;
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vNormal;

            // simple pseudo noise
            float noise(vec2 p) {
              return sin(p.x) * sin(p.y);
            }

            void main() {
              vec2 uv = vUv;

              // radial distance from center
              float d = distance(uv, vec2(0.5));

              // base color gradient
              vec3 core = vec3(1.0, 0.98, 0.85); // hot white
              vec3 mid = vec3(1.0, 0.84, 0.0);  // gold
              vec3 edge = vec3(1.0, 0.45, 0.0);  // orange

              vec3 color = mix(core, mid, d * 1.3);
              color = mix(color, edge, d * d);

              // animated plasma noise
              float n = noise(uv * 10.0 + uTime * 0.6);
              color += n * 0.08;

              // fresnel rim glow
              float fres = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
              color += vec3(1.0, 0.7, 0.2) * fres * 0.6;

              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* HALO 1 */}
      <mesh ref={halo1Ref}>
        <sphereGeometry args={[1.05, 16, 16]} />
        <meshBasicMaterial
          color="#FFD600"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* HALO 2 */}
      <mesh ref={halo2Ref}>
        <sphereGeometry args={[1.55, 12, 12]} />
        <meshBasicMaterial
          color="#FF8F00"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* HALO 3 */}
      <mesh ref={halo3Ref}>
        <sphereGeometry args={[2.2, 10, 10]} />
        <meshBasicMaterial
          color="#FF6D00"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* LABEL */}
      <Billboard>
        <Text
          position={[0, 1.18, 0]}
          fontSize={0.20}
          color="#FFF9C4"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
          outlineWidth={0.008}
          outlineColor="#000000"
        >
          SAURAV
        </Text>
      </Billboard>

      {/* LIGHT SOURCES */}
      <pointLight color="#FFFDE7" intensity={5} distance={22} decay={2} />
      <pointLight color="#FFB300" intensity={2.5} distance={10} decay={2} />
    </group>
  )
}

// ─── Orbit path ring ─────────────────────────────────────────────────────────
const OrbitRing = () => (
  <mesh rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[ORBIT_R, 0.006, 2, 140]} />
    <meshBasicMaterial
      color="#ffffff"
      transparent
      opacity={0.07}
      depthWrite={false}
    />
  </mesh>
)

// ─── Planet ───────────────────────────────────────────────────────────────────
const Planet = ({ skill, index }) => {
  const groupRef = useRef()
  const meshRef  = useRef()
  const g1Ref    = useRef()
  const g2Ref    = useRef()
  const scaleRef = useRef(1)
  const wpRef    = useRef(new THREE.Vector3())

  // Fixed local position within the orbit group
  const localAngle = (index / N) * TWO_PI
  const localX     = Math.cos(localAngle) * ORBIT_R
  const localZ     = Math.sin(localAngle) * ORBIT_R

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Self-rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.006
      meshRef.current.rotation.x += 0.002
    }

    // World position to determine active (closest to camera = max world Z)
    if (!groupRef.current) return
    groupRef.current.getWorldPosition(wpRef.current)
    // Threshold: active when world Z > 75% of orbit radius
    const isActive = wpRef.current.z > ORBIT_R * 0.72

    // Scale spring
    const tgtScale  = isActive ? 1.38 : 1.0
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, tgtScale, 0.065)
    groupRef.current.scale.setScalar(scaleRef.current)

    // Glow intensity
    if (g1Ref.current) {
      g1Ref.current.material.opacity = THREE.MathUtils.lerp(
        g1Ref.current.material.opacity,
        isActive ? 0.24 : 0.055,
        0.06
      )
    }
    if (g2Ref.current) {
      g2Ref.current.material.opacity = THREE.MathUtils.lerp(
        g2Ref.current.material.opacity,
        isActive ? 0.09 : 0.0,
        0.055
      )
    }
  })

  return (
    <group ref={groupRef} position={[localX, 0, localZ]}>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[skill.size, 22, 22]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.emissive}
          emissiveIntensity={0.65}
          roughness={0.50}
          metalness={0.12}
        />
      </mesh>

      {/* Tight glow */}
      <mesh ref={g1Ref}>
        <sphereGeometry args={[skill.size * 1.65, 10, 10]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wide glow */}
      <mesh ref={g2Ref}>
        <sphereGeometry args={[skill.size * 2.6, 8, 8]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={0.0}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Label — always faces camera via Billboard */}
      <Billboard>
        <Text
          position={[0, skill.size + 0.30, 0]}
          fontSize={0.17}
          color="#e8e8ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.09}
          outlineWidth={0.010}
          outlineColor="#000000"
          outlineOpacity={0.6}
        >
          {skill.name}
        </Text>
      </Billboard>
    </group>
  )
}

// ─── Orbit group — rotates with scroll ───────────────────────────────────────
const OrbitGroup = ({ scrollRef, onActiveChange }) => {
  const groupRef  = useRef()
  const rotRef    = useRef(INIT_ROT)
  const activeRef = useRef(0)

  useFrame(() => {
    if (!groupRef.current) return

    // Lerp toward target rotation
    const target = INIT_ROT - scrollRef.current * TWO_PI
    rotRef.current = THREE.MathUtils.lerp(rotRef.current, target, 0.048)
    groupRef.current.rotation.y = rotRef.current

    // Active detection: planet with max world Z
    let maxZ = -Infinity, maxIdx = 0
    for (let i = 0; i < N; i++) {
      const worldAngle = (i / N) * TWO_PI + rotRef.current
      const z = Math.sin(worldAngle) * ORBIT_R
      if (z > maxZ) { maxZ = z; maxIdx = i }
    }
    if (maxIdx !== activeRef.current) {
      activeRef.current = maxIdx
      onActiveChange(maxIdx)
    }
  })

  return (
    <group ref={groupRef}>
      <OrbitRing />
      {SOLAR_SKILLS.map((skill, i) => (
        <Planet key={skill.name} skill={skill} index={i} />
      ))}
    </group>
  )
}

// ─── Gentle camera bob ───────────────────────────────────────────────────────
const CameraRig = () => {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.y = 3.5 + Math.sin(t * 0.18) * 0.18
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Full R3F scene ───────────────────────────────────────────────────────────
const Scene = ({ scrollRef, onActiveChange }) => {
  const handleActive = useCallback((idx) => {
    onActiveChange(idx)
  }, [onActiveChange])

  return (
    <>
      <color attach="background" args={['#03030E']} />
      <fog attach="fog" args={['#03030E', 18, 40]} />

      <ambientLight intensity={0.06} />

      {/* Distant star field */}
      <Stars
        radius={90}
        depth={55}
        count={2800}
        factor={3.2}
        saturation={0.1}
        fade
        speed={0.3}
      />

      <CameraRig />
      <Sun />
      <OrbitGroup scrollRef={scrollRef} onActiveChange={handleActive} />
    </>
  )
}

// ─── Root export ─────────────────────────────────────────────────────────────
const Skills = () => {
  const sectionRef = useRef(null)
  const scrollRef  = useRef(0)
  const [activeIdx, setActiveIdx] = useState(0)
  const [showHint,  setShowHint]  = useState(true)

  // Read scroll position relative to this section
  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return
      const rect      = sectionRef.current.getBoundingClientRect()
      const maxScroll = sectionRef.current.offsetHeight - window.innerHeight
      const scrolled  = -rect.top
      scrollRef.current = Math.max(0, Math.min(1, scrolled / maxScroll))
      if (scrolled > 80) setShowHint(false)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const inView = useInView(sectionRef, { once: true, amount: 0.05 })

  const handleActiveChange = useCallback((idx) => setActiveIdx(idx), [])

  const active = SOLAR_SKILLS[activeIdx]

  return (
    <section id="skills" className="solar-section" ref={sectionRef}>

      {/* Sticky viewport */}
      <div className="solar-sticky">

        {/* Section heading */}
        <div className="solar-header">
          <SectionTitle
            eyebrow="// TOOLS OF THE TRADE"
            title="Skills & Technologies"
            inView={inView}
          />
        </div>

        {/* 3D canvas — pointer events off so page scroll works */}
        <Canvas
          className="solar-canvas"
          camera={{ position: [0, 3.5, 10.5], fov: 54 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
          style={{ pointerEvents: 'none' }}
        >
          <Scene scrollRef={scrollRef} onActiveChange={handleActiveChange} />
        </Canvas>

        {/* ── HUD overlay ── */}

        {/* Active skill card */}
        <div className="solar-hud-bottom">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              className="solar-skill-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <span
                className="solar-skill-name"
                style={{ color: active.color, textShadow: `0 0 18px ${active.color}88` }}
              >
                {active.name}
              </span>
              <span className="solar-skill-sub">{active.sub}</span>
            </motion.div>
          </AnimatePresence>

          {/* Dot nav */}
          <div className="solar-dots" role="list" aria-label="Skills">
            {SOLAR_SKILLS.map((skill, i) => (
              <motion.div
                key={i}
                role="listitem"
                className="solar-dot"
                animate={{
                  scale: i === activeIdx ? 1.6 : 1,
                  backgroundColor: i === activeIdx ? skill.color : 'rgba(255,255,255,0.2)',
                  boxShadow: i === activeIdx ? `0 0 10px 2px ${skill.color}88` : 'none',
                }}
                transition={{ duration: 0.22 }}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              className="solar-scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
            >
              <span>SCROLL TO EXPLORE</span>
              <motion.span
                className="solar-hint-arrow"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↓
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top-right planet counter */}
        <div className="solar-counter">
          <span className="solar-counter-idx">
            {String(activeIdx + 1).padStart(2, '0')}
          </span>
          <span className="solar-counter-sep">/</span>
          <span className="solar-counter-total">{String(N).padStart(2, '0')}</span>
        </div>

      </div>
    </section>
  )
}

export default Skills