import { useEffect, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import './ScrollProgress.css'

const ScrollProgress = () => {
  const { progress, isScrolled } = useScrollProgress()
  const labelRef = useRef(null)

  // Springy scale for the fill bar
  const scaleX = useSpring(progress, {
    stiffness: 120,
    damping:    28,
    restDelta:  0.001,
  })

  // Update the percentage label imperatively — avoids a React re-render on every scroll tick
  useEffect(() => {
    const unsub = scaleX.on('change', (v) => {
      if (labelRef.current) {
        labelRef.current.textContent = `${Math.round(v * 100).toString().padStart(3, '0')}%`
      }
    })
    return unsub
  }, [scaleX])

  return (
    <>
      {/* ── Background rail ── */}
      <div className="scroll-progress-track" aria-hidden="true">

        {/* ── Filled bar ── */}
        <motion.div
          className="scroll-progress"
          style={{ scaleX, transformOrigin: 'left' }}
        >
          {/* Glowing head pip — child of bar so it sits at the leading edge */}
          <motion.div
            className="scroll-progress-pip"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: progress > 0.012 ? 1 : 0,
              scale:   progress > 0.012 ? 1 : 0,
            }}
            transition={{ duration: 0.18 }}
          />
        </motion.div>

      </div>

      {/* ── Percentage readout — fades in once scrolled past 60px ── */}
      <span
        ref={labelRef}
        className={`scroll-progress-label${isScrolled ? ' scroll-progress-label--visible' : ''}`}
        aria-hidden="true"
      >
        000%
      </span>
    </>
  )
}

export default ScrollProgress