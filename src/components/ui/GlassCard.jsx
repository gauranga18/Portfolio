import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import './GlassCard.css'

// ─── Config ───────────────────────────────────────────────────────────────────
const TILT_MAX    = 8     // degrees
const SPRING_CFG  = { stiffness: 280, damping: 22, mass: 0.6 }

// ─── GlassCard ────────────────────────────────────────────────────────────────
const GlassCard = ({
  children,
  className = '',
  style     = {},
  onClick,
  tilt      = true,   // disable 3-D tilt if card is in a scroll list etc.
  ...props
}) => {
  const cardRef = useRef(null)

  // Raw motion values for mouse position (−1 → 1)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Springified so the tilt eases in/out smoothly
  const springX = useSpring(rawX, SPRING_CFG)
  const springY = useSpring(rawY, SPRING_CFG)

  // Map to rotateX / rotateY
  const rotateX = useTransform(springY, [-1, 1], [ TILT_MAX, -TILT_MAX])
  const rotateY = useTransform(springX, [-1, 1], [-TILT_MAX,  TILT_MAX])

  // Subtle scale-up on hover driven by the same spring
  const scale = useSpring(1, SPRING_CFG)

  const handleMouseMove = useCallback((e) => {
    if (!tilt || !cardRef.current) return
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    rawX.set(((e.clientX - left) / width  - 0.5) * 2)
    rawY.set(((e.clientY - top)  / height - 0.5) * 2)
  }, [tilt, rawX, rawY])

  const handleMouseEnter = useCallback(() => {
    scale.set(1.025)
  }, [scale])

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    scale.set(1)
  }, [rawX, rawY, scale])

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card ${className}`}
      style={{
        ...style,
        rotateX:    tilt ? rotateX : 0,
        rotateY:    tilt ? rotateY : 0,
        scale,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      onClick={onClick}

      /* Framer handles border-color + box-shadow transitions */
      whileHover={{ borderColor: 'rgba(200, 134, 10, 0.45)' }}
      whileTap={{
        scale: 0.975,
        transition: { duration: 0.12 },
      }}
      transition={{ duration: 0.22 }}

      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}

      {...props}
    >
      {/* ── CSS-driven FX layers (all aria-hidden) ── */}

      {/* Chromatic aberration ghost borders */}
      <div className="glass-card-rgb glass-card-rgb--r" aria-hidden />
      <div className="glass-card-rgb glass-card-rgb--b" aria-hidden />

      {/* Inner glow ring */}
      <div className="glass-card-glow" aria-hidden />

      {/* Holo shimmer sweep */}
      <div className="glass-card-shimmer" aria-hidden />

      {/* Horizontal edge scan line */}
      <div className="glass-card-scan" aria-hidden />

      {/* HUD corner brackets */}
      <div className="glass-card-corner glass-card-corner--tl" aria-hidden />
      <div className="glass-card-corner glass-card-corner--tr" aria-hidden />
      <div className="glass-card-corner glass-card-corner--bl" aria-hidden />
      <div className="glass-card-corner glass-card-corner--br" aria-hidden />

      {/* Actual card content — sits above all FX layers */}
      <div style={{ position: 'relative', zIndex: 6 }}>
        {children}
      </div>
    </motion.div>
  )
}

export default GlassCard