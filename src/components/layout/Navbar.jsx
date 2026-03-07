import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS } from '../../utils/constants'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import ScrollProgress from '../ui/ScrollProgress'
import './Navbar.css'

const Navbar = () => {
  const { isScrolled } = useScrollProgress()
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (href) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <ScrollProgress />
      <motion.header
        className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        role="banner"
      >
        <nav className="navbar__inner container" aria-label="Main navigation">
          {/* Logo */}
          <button
            className="navbar__logo"
            onClick={() => scrollTo('#main-content')}
            aria-label="Go to top"
          >
            <span className="logo-sj">SJ</span>
            <span className="logo-dot" aria-hidden="true">.</span>
          </button>

          {/* Desktop links */}
          <ul className="navbar__links" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <button
                  className={`navbar__link ${activeSection === item.href ? 'navbar__link--active' : ''}`}
                  onClick={() => scrollTo(item.href)}
                  aria-current={activeSection === item.href ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Hire CTA */}
          <a
            href="mailto:sauravjyoti@proton.me"
            className="navbar__cta"
            aria-label="Hire me via email"
          >
            Hire Me
          </a>

          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${mobileOpen ? 'is-open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <ul className="mobile-menu__links" role="list">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.4 }}
                >
                  <button
                    className="mobile-menu__link"
                    onClick={() => scrollTo(item.href)}
                  >
                    <span className="mobile-link-num">0{i + 1}.</span>
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mobile-menu__footer">
              <a href="mailto:sauravjyoti@proton.me" className="mobile-menu__email">
                sauravjyoti@proton.me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
