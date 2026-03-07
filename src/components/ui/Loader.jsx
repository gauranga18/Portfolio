import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Loader.css'

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [started, text])

  return <span className="loader-typewriter">{displayed}<span className="loader-caret">|</span></span>
}

const Loader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2900)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="loader"
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background particles */}
      <div className="loader-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="loader-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top:  `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="loader-content">
        {/* Monogram */}
        <motion.div
          className="loader-monogram"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span>SJ</span>
          <div className="loader-monogram-ring" />
        </motion.div>

        {/* Sweep line */}
        <motion.div
          className="loader-sweep"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Typewriter text */}
        <motion.div
          className="loader-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <TypewriterText text="saurav.dev" delay={1.1} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="loader-tagline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          Roots in Assam. Building the future.
        </motion.p>
      </div>
    </motion.div>
  )
}

export default Loader
