import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaCheck, FaCopy
} from 'react-icons/fa'
import { PERSONAL } from '../../utils/constants'
import SectionTitle from '../ui/SectionTitle'
import GlassCard from '../ui/GlassCard'
import { staggerContainer, scaleIn } from '../../utils/animations'
import './Contact.css'

const SOCIALS = [
  {
    label:    'GitHub',
    handle:   'gauranga18',
    icon:     FaGithub,
    href:     PERSONAL.github,
    color:    '#c8860a',
  },
  {
    label:    'LinkedIn',
    handle:   'saurav-jyoti',
    icon:     FaLinkedin,
    href:     PERSONAL.linkedin,
    color:    '#0a66c2',
  },
  {
    label:    'Instagram',
    handle:   'saurav_.30__',
    icon:     FaInstagram,
    href:     PERSONAL.instagram,
    color:    '#e1306c',
  },
  {
    label:    'Email',
    handle:   PERSONAL.email,
    icon:     FaEnvelope,
    href:     `mailto:${PERSONAL.email}`,
    color:    '#52b788',
  },
]

const Contact = () => {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true, amount: 0.2 })
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <section id="contact" className="contact section" ref={ref}>
      {/* Assam map watermark */}
      <div className="contact-watermark" aria-hidden="true">
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20,120 Q40,60 80,50 Q120,40 150,70 Q180,100 220,90 Q260,80 280,110 Q270,150 240,160 Q200,170 160,155 Q120,140 80,155 Q50,165 25,145 Z"
            stroke="rgba(200,134,10,0.08)"
            strokeWidth="2"
            fill="rgba(45,106,79,0.03)"
          />
          <text x="140" y="120" fontSize="10" fill="rgba(200,134,10,0.12)" textAnchor="middle" fontFamily="serif">Assam</text>
        </svg>
      </div>

      <div className="container">
        <SectionTitle
          eyebrow="// GET IN TOUCH"
          title="Let's Build Something."
          inView={inView}
        />

        <div className="contact-layout">
          {/* ── Left ──────────────────────────────── */}
          <motion.div
            className="contact-left"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="contact-copy">
              Whether it's systems programming, DevOps, or just a conversation
              about C — I'm always open. Let's build something together.
            </p>

            {/* Email copy button */}
            <button
              className="email-copy"
              onClick={copyEmail}
              aria-label={copied ? 'Email copied!' : `Copy email address ${PERSONAL.email}`}
            >
              <span className="email-copy__addr">{PERSONAL.email}</span>
              <span className="email-copy__icon">
                {copied ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}
              </span>
              {copied && (
                <motion.span
                  className="email-copy__toast"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Copied!
                </motion.span>
              )}
            </button>

            <p className="contact-response">
              I typically respond within 24 hours ☀️
            </p>
          </motion.div>

          {/* ── Right: Social grid ──────────────── */}
          <motion.div
            className="contact-socials"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            aria-label="Social links"
          >
            {SOCIALS.map((s) => {
              const Icon = s.icon
              return (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="social-card"
                  variants={scaleIn}
                  whileHover={{ y: -6, boxShadow: `0 8px 32px ${s.color}22` }}
                  aria-label={`${s.label}: ${s.handle}`}
                >
                  <div className="social-card__icon" style={{ color: s.color }}>
                    <Icon aria-hidden="true" />
                  </div>
                  <div>
                    <p className="social-card__label">{s.label}</p>
                    <p className="social-card__handle">{s.handle}</p>
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
