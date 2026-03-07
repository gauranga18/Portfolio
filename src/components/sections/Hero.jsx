import { Suspense, lazy, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useMousePosition } from '../../hooks/useMousePosition'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { PERSONAL } from '../../utils/constants'
import MagneticButton from '../ui/MagneticButton'
import { FaGithub, FaArrowDown } from 'react-icons/fa'
import './Hero.css'

const TerminalCube    = lazy(() => import('../three/TerminalCube'))
const ParticleField   = lazy(() => import('../three/ParticleField'))
const FloatingGeometry = lazy(() => import('../three/FloatingGeometry'))

const ROLES = PERSONAL.roles

const RoleCycler = () => {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % ROLES.length)
        setVisible(true)
      }, 400)
    }, 2600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero-role" aria-live="polite">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="hero-role__text"
          >
            {ROLES[idx]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

const Hero = () => {
  const { normalised }  = useMousePosition()
  const { scrollY }     = useScrollProgress()
  const showScroll      = scrollY < 120

  return (
    <section className="hero section" id="hero" aria-label="Hero">
      {/* Radial background glow */}
      <div className="hero-glow" aria-hidden="true" />

      <div className="container hero-layout">
        {/* ── Left: Text Content ────────────────────────── */}
        <div className="hero-text">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-greeting">
              Hi 👋, I'm
            </span>
          </motion.div>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Saurav
            <br />
            <span className="hero-name--accent">Jyoti</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <RoleCycler />
          </motion.div>

          <motion.p
            className="hero-bio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            Systems programmer from the misty valleys of Assam,
            obsessed with how computers work at their lowest level.
            Building developer infrastructure, one malloc at a time.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <MagneticButton
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
              variant="primary"
              ariaLabel="View my projects"
            >
              View Projects
            </MagneticButton>
            <MagneticButton
              href={PERSONAL.github}
              variant="secondary"
              ariaLabel="Visit GitHub profile"
            >
              <FaGithub aria-hidden="true" /> GitHub
            </MagneticButton>
          </motion.div>

          <motion.div
            className="hero-location"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <span className="hero-location__dot" aria-hidden="true" />
            <span>📍 Assam, India</span>
          </motion.div>
        </div>

        {/* ── Right: 3D Canvas ──────────────────────────── */}
        <motion.div
          className="hero-canvas-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 55 }}
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
          >
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            <Suspense fallback={null}>
              <ParticleField />
              <FloatingGeometry />
              <TerminalCube mouseNorm={normalised} />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Mobile fallback — static decorative */}
        <div className="hero-fallback" aria-hidden="true">
          <div className="hero-fallback__ring" />
          <div className="hero-fallback__inner">
            <span>SJ</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <AnimatePresence>
        {showScroll && (
          <motion.div
            className="hero-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2 }}
            aria-label="Scroll to explore"
          >
            <FaArrowDown className="animate-bounce-y" aria-hidden="true" />
            <span>scroll to explore</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Hero
