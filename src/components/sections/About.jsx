import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { STATS } from '../../utils/constants'
import SectionTitle from '../ui/SectionTitle'
import GlassCard from '../ui/GlassCard'
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from '../../utils/animations'
import './About.css'

const CountUp = ({ target, inView }) => {
  const [count, setCount] = useState(0)
  const isNumeric = /^\d+$/.test(target)

  useEffect(() => {
    if (!inView || !isNumeric) return
    const end = parseInt(target)
    const dur  = 1500
    const step = dur / end
    let current = 0
    const timer = setInterval(() => {
      current++
      setCount(current)
      if (current >= end) clearInterval(timer)
    }, step)
    return () => clearInterval(timer)
  }, [inView, target, isNumeric])

  if (!isNumeric) return <>{target}</>
  return <>{count}</>
}

const About = () => {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="container">
        <SectionTitle
          eyebrow="// WHO I AM"
          title="About Me"
          subtitle="A systems programmer with roots in the northeast."
          inView={inView}
        />

        <div className="about-layout">
          {/* ── Left: Avatar card ─────────────────── */}
          <motion.div
            className="about-avatar-wrap"
            variants={slideInLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <GlassCard className="about-avatar-card">
              {/* Avatar placeholder */}
              <div className="avatar-img" aria-label="Saurav Jyoti avatar">
                <div className="avatar-initials">SJ</div>
                <div className="avatar-ring" aria-hidden="true" />
              </div>

              {/* Location badge */}
              <div className="about-location">
                <FaMapMarkerAlt className="about-location__icon" aria-hidden="true" />
                Assam, India
              </div>

            </GlassCard>

            {/* Status indicator */}
            <div className="about-status">
              <span className="status-dot" aria-hidden="true" />
              <span>Open to opportunities</span>
            </div>
          </motion.div>

          {/* ── Right: Text content ─────────────── */}
          <motion.div
            className="about-content"
            variants={slideInRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <p className="about-para">
              I'm a systems programmer from the misty valleys of Assam, obsessed with
              how things work at their lowest level. My primary language is C — not
              because it's trendy, but because it forces you to understand every byte
              your program touches.
            </p>
            <p className="about-para">
              I spend most of my time building developer infrastructure tools, exploring
              Linux kernel internals, and writing memory-safe C programs with the help
              of GDB and Valgrind. When I'm not coding, you'll find me by the Brahmaputra.
            </p>

            {/* Stats */}
            <motion.div
              className="about-stats"
              variants={staggerContainer(0.15, 0.3)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} className="stat-card" variants={fadeUp}>
                  <GlassCard className="stat-card__inner">
                    <span className="stat-value">
                      <CountUp target={stat.value.replace(/\D/g, '') || stat.value} inView={inView} />
                      {stat.value.match(/[+∞]/) ? stat.value.replace(/\d/g, '') : ''}
                    </span>
                    <span className="stat-label">{stat.label}</span>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Currently */}
            <div className="about-currently">
              <p className="currently-label">// Currently</p>
              <ul className="currently-list">
                <li>🔭 Building Developer Infrastructure Tools</li>
                <li>🌱 Deep diving into DevOps & C internals</li>
                <li>📍 Based in Assam, open to remote</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
