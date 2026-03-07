import { motion } from 'framer-motion'
import { fadeUp } from '../../utils/animations'
import './SectionTitle.css'

const SectionTitle = ({ eyebrow, title, subtitle, align = 'center', inView = true }) => (
  <motion.div
    className={`section-title section-title--${align}`}
    variants={fadeUp}
    initial="hidden"
    animate={inView ? 'visible' : 'hidden'}
  >
    {eyebrow && (
      <span className="section-title__eyebrow">{eyebrow}</span>
    )}
    <h2 className="section-title__heading">{title}</h2>
    <div className="section-title__line" />
    {subtitle && (
      <p className="section-title__subtitle">{subtitle}</p>
    )}
  </motion.div>
)

export default SectionTitle
