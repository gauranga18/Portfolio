import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EXPERIENCE } from '../../utils/constants'
import SectionTitle from '../ui/SectionTitle'
import GlassCard from '../ui/GlassCard'
import { fadeUp, staggerContainer } from '../../utils/animations'
import './Experience.css'

const Experience = () => {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section id="experience" className="experience section" ref={ref}>
      {/* Decorative vertical glow */}
      <div className="experience-glow" aria-hidden="true" />

      <div className="container">
        <SectionTitle
          eyebrow="// MY JOURNEY"
          title="Experience"
          subtitle="Where I've been, what I've built."
          inView={inView}
        />

        <div className="timeline" role="list">
          {/* Animated SVG line */}
          <svg
            className="timeline-svg"
            viewBox="0 0 4 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.line
              x1="2" y1="0" x2="2" y2="1000"
              stroke="url(#timelineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%"   stopColor="#c8860a" stopOpacity="1" />
                <stop offset="100%" stopColor="#2d6a4f" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          <motion.div
            className="timeline-items"
            variants={staggerContainer(0.2, 0.3)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {EXPERIENCE.map((entry, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                variants={fadeUp}
                role="listitem"
              >
                {/* Node dot */}
                <motion.div
                  className="timeline-node"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.4 + i * 0.2, type: 'spring', stiffness: 300 }}
                  aria-hidden="true"
                />

                <GlassCard className="timeline-card">
                  <div className="timeline-card__meta">
                    <span className="timeline-year">{entry.year}</span>
                    <span className="type-badge badge">{entry.type}</span>
                  </div>
                  <h3 className="timeline-title">{entry.title}</h3>
                  <p className="timeline-tech">{entry.tech}</p>
                  <p className="timeline-desc">{entry.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Experience
