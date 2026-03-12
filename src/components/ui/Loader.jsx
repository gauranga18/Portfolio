import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Loader.css'

// ─── Constants — edit these ───────────────────────────────────────────────────
const MONOGRAM  = 'SJ'
const SITE_NAME = 'saurav.dev'
const TAGLINE   = 'Roots in Assam. Building the future.'

const STATUS_MSGS = [
  'BOOTING_SYSTEM...',
  'LOADING_ASSETS...',
  'INIT_3D_ENGINE...',
  'SYSTEM_READY    ',
]

const NEON = [
  'var(--color-accent-gold)',
  '#ff00ff',
  '#00ffff',
  '#39ff14',
  '#ff69b4',
]

// ─── Helpers — seeded once per mount, never on re-render ─────────────────────
const makeParticles = (n) =>
  Array.from({ length: n }, () => ({
    left:  `${(Math.random() * 96 + 2).toFixed(1)}%`,
    top:   `${(Math.random() * 96 + 2).toFixed(1)}%`,
    color: NEON[Math.floor(Math.random() * NEON.length)],
    delay: `${(Math.random() * 3).toFixed(2)}s`,
    dur:   `${(2.5 + Math.random() * 3).toFixed(2)}s`,
    tx:    `${(Math.random() * 160 - 80).toFixed(0)}px`,
    ty:    `${(Math.random() * 160 - 80).toFixed(0)}px`,
    tx2:   `${(Math.random() * 200 - 100).toFixed(0)}px`,
    ty2:   `${(Math.random() * 160 - 80).toFixed(0)}px`,
  }))

const makeStars = (n) =>
  Array.from({ length: n }, () => ({
    left:  `${(Math.random() * 92 + 4).toFixed(1)}%`,
    top:   `${(Math.random() * 92 + 4).toFixed(1)}%`,
    rot:   `${Math.floor(Math.random() * 360)}deg`,
    delay: `${(Math.random() * 4).toFixed(2)}s`,
    dur:   `${(3 + Math.random() * 4).toFixed(2)}s`,
  }))

// ─── TypewriterText ───────────────────────────────────────────────────────────
const TypewriterText = ({ text, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('')
  const [started,   setStarted]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(iv)
    }, 75)
    return () => clearInterval(iv)
  }, [started, text])

  return (
    <span className="loader-typewriter">
      {displayed}
      <span className="loader-caret">▮</span>
    </span>
  )
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
const ProgressBar = () => (
  <motion.div
    className="loader-progress-wrap"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.2, duration: 0.4 }}
  >
    <div className="loader-progress-bar">
      <div className="loader-progress-fill" />
      <div className="loader-progress-ticks" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="loader-progress-tick" />
        ))}
      </div>
    </div>
    <div className="loader-progress-label">
      <span>SYS_INIT</span>
      <span>v2.0.0</span>
    </div>
  </motion.div>
)

// ─── StatusRow ────────────────────────────────────────────────────────────────
const StatusRow = () => {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const iv = setInterval(
      () => setIdx(i => Math.min(i + 1, STATUS_MSGS.length - 1)),
      560
    )
    return () => clearInterval(iv)
  }, [])

  return (
    <motion.div
      className="loader-status"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.4 }}
    >
      <span className="loader-status-dot" />
      <span className="loader-status-dot" />
      <span className="loader-status-dot" />
      <span className="loader-status-text">{STATUS_MSGS[idx]}</span>
    </motion.div>
  )
}

// ─── TaglineReveal — per-character stagger ────────────────────────────────────
const TaglineReveal = ({ text }) => (
  <motion.p
    className="loader-tagline"
    aria-label={text}
    initial="hidden"
    animate="visible"
    variants={{
      hidden:  {},
      visible: {
        transition: { delayChildren: 2.1, staggerChildren: 0.03 },
      },
    }}
  >
    {text.split('').map((ch, i) => (
      <motion.span
        key={i}
        style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : undefined }}
        variants={{
          hidden:  { opacity: 0, y: 7,  skewX: -4 },
          visible: { opacity: 1, y: 0,  skewX: 0,
            transition: { duration: 0.25, ease: 'easeOut' } },
        }}
      >
        {ch}
      </motion.span>
    ))}
  </motion.p>
)

// ─── Loader ───────────────────────────────────────────────────────────────────
const Loader = ({ onComplete }) => {
  const particles = useRef(makeParticles(28))
  const stars     = useRef(makeStars(6))

  useEffect(() => {
    const t = setTimeout(onComplete, 3200)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      className="loader"
      exit={{
        opacity: 0,
        y: '-100%',
        clipPath: 'inset(0 0 100% 0)',
      }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* CRT scanline beam */}
      <div className="loader-scanline" aria-hidden />

      {/* HUD corner brackets */}
      {['tl', 'tr', 'bl', 'br'].map(pos => (
        <div key={pos} className={`loader-corner loader-corner--${pos}`} aria-hidden />
      ))}

      {/* Particles + burst stars */}
      <div className="loader-particles" aria-hidden>
        {particles.current.map((p, i) => (
          <div
            key={i}
            className="loader-particle"
            style={{
              left: p.left,
              top:  p.top,
              background: p.color,
              animationDelay:    p.delay,
              animationDuration: p.dur,
              '--tx':  p.tx,  '--ty':  p.ty,
              '--tx2': p.tx2, '--ty2': p.ty2,
            }}
          />
        ))}
        {stars.current.map((s, i) => (
          <div
            key={`st-${i}`}
            className="loader-burst-star"
            style={{
              left: s.left,
              top:  s.top,
              '--r': s.rot,
              animationDelay:    s.delay,
              animationDuration: s.dur,
            }}
          />
        ))}
      </div>

      {/* ── Central content ── */}
      <div className="loader-content">

        {/* Monogram */}
        <motion.div
          className="loader-monogram"
          data-char={MONOGRAM}
          initial={{ scale: 0, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="loader-monogram-hex"         aria-hidden />
          <div className="loader-monogram-ring"        aria-hidden />
          <div className="loader-monogram-ring-inner"  aria-hidden />
          <span>{MONOGRAM}</span>
        </motion.div>

        {/* Sweep line */}
        <motion.div
          className="loader-sweep"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.62, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Typewriter site name */}
        <motion.div
          className="loader-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.3 }}
        >
          <TypewriterText text={SITE_NAME} delay={1.0} />
        </motion.div>

        {/* Progress bar */}
        <ProgressBar />

        {/* Status dots + message */}
        <StatusRow />

        {/* Tagline */}
        <TaglineReveal text={TAGLINE} />

      </div>
    </motion.div>
  )
}

export default Loader