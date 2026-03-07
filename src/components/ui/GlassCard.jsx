import { motion } from 'framer-motion'
import './GlassCard.css'

const GlassCard = ({ children, className = '', style = {}, onClick, ...props }) => (
  <motion.div
    className={`glass-card ${className}`}
    style={style}
    onClick={onClick}
    whileHover={{ borderColor: 'rgba(200,134,10,0.4)' }}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.div>
)

export default GlassCard
