import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './MagneticButton.css'

const MagneticButton = ({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  ariaLabel,
  ...props
}) => {
  const ref   = useRef(null)
  const x     = useMotionValue(0)
  const y     = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouseMove = (e) => {
    const rect   = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    x.set((e.clientX - cx) * 0.25)
    y.set((e.clientY - cy) * 0.25)
  }

  const handleMouseLeave = () => { x.set(0); y.set(0) }

  const Tag = href ? 'a' : 'button'

  return (
    <motion.div
      ref={ref}
      className={`magnetic-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      <Tag
        href={href}
        onClick={onClick}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
        className={`magnetic-btn magnetic-btn--${variant}`}
        {...props}
      >
        {children}
      </Tag>
    </motion.div>
  )
}

export default MagneticButton
