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
> <svg viewBox="0 0 100 100">


    {/* base */}
    <circle
      cx="50"
      cy="50"
      r="48"
      fill="#f4e4bc"
      stroke="#c40000"
      strokeWidth="3"
    />

    {/* radial bamboo */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2
      const x = 50 + Math.cos(angle) * 48
      const y = 50 + Math.sin(angle) * 48

      return (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={x}
          y2={y}
          stroke="#c9a25f"
          strokeWidth="1.2"
        />
      )
    })}

    {/* star */}
    <polygon
      points="
      50,14
      60,38
      86,50
      60,62
      50,86
      40,62
      14,50
      40,38
      "
      fill="#c40000"
    />

  </svg>
</motion.div>


)
}

export default Cursor
