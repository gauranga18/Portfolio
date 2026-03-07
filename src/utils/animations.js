// ── Framer Motion variant presets ────────────────────────

export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

export const slideInLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
}

export const slideInRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  }
}

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden:  {},
  visible: {
    transition: { staggerChildren, delayChildren }
  }
})

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02, y: -6,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
}

export const navbarVariants = {
  top:      { backgroundColor: 'rgba(6,15,7,0)',   backdropFilter: 'blur(0px)' },
  scrolled: { backgroundColor: 'rgba(6,15,7,0.95)', backdropFilter: 'blur(20px)' }
}

export const loaderVariants = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0, scale: 1.05,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}
