import { useEffect } from "react"
import { motion, useMotionValue } from "framer-motion"
import "./Cursor.css"

const Cursor = () => {
const x = useMotionValue(-100)
const y = useMotionValue(-100)

useEffect(() => {
const move = (e) => {
x.set(e.clientX)
y.set(e.clientY)
}


document.addEventListener("mousemove", move)

return () => {
  document.removeEventListener("mousemove", move)
}


}, [])

return (
<motion.div
className="japi-cursor"
style={{ x, y }}
>
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" fill="var(--color-accent-gold)" />
    <line x1="12" y1="0" x2="12" y2="24" stroke="var(--color-accent-gold)" strokeWidth="0.5" />
    <line x1="0" y1="12" x2="24" y2="12" stroke="var(--color-accent-gold)" strokeWidth="0.5" />
  </svg>
</motion.div>


)
}

export default Cursor
