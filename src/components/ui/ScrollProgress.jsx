import { motion, useSpring } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import './ScrollProgress.css'

const ScrollProgress = () => {
  const { progress } = useScrollProgress()
  const scaleX = useSpring(progress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, transformOrigin: 'left' }}
      aria-hidden="true"
    />
  )
}

export default ScrollProgress
