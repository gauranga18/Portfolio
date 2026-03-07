import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

import {
SiC,
SiYaml,
SiGnubash,
SiMake,
SiAnsible
} from 'react-icons/si'

import {
FaJava,
FaLinux,
FaGitAlt,
FaDocker,
FaPython,
FaBug
} from 'react-icons/fa'

import { SKILLS } from '../../utils/constants'
import SectionTitle from '../ui/SectionTitle'
import { staggerContainer, fadeUp } from '../../utils/animations'
import './Skills.css'

const ICON_MAP = {
SiC,
SiYaml,
SiGnubash,
SiMake,
SiAnsible,
FaBug,
FaJava,
FaLinux,
FaGitAlt,
FaDocker,
FaPython,
}

const SkillCard = ({ skill }) => {
const [tilt, setTilt] = useState({ x: 0, y: 0 })
const Icon = ICON_MAP[skill.icon] || SiC

const handleMouseMove = (e) => {
const rect = e.currentTarget.getBoundingClientRect()


const cx = rect.left + rect.width / 2
const cy = rect.top + rect.height / 2

setTilt({
  x: ((e.clientY - cy) / (rect.height / 2)) * -6,
  y: ((e.clientX - cx) / (rect.width / 2)) * 6,
})


}

return (
<motion.div
className="skill-card"
variants={fadeUp}
style={{
transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
}}
onMouseMove={handleMouseMove}
onMouseLeave={() => setTilt({ x: 0, y: 0 })}
whileHover={{ scale: 1.05 }}
>
<div className="skill-icon" style={{ color: skill.color }}> <Icon /> </div>


  <h3 className="skill-name">
    {skill.name}
  </h3>

  <span className="skill-tag badge">
    {skill.tag}
  </span>
</motion.div>


)
}

const Skills = () => {
const ref = useRef(null)

const inView = useInView(ref, {
once: true,
amount: 0.1
})

return ( <section id="skills" className="skills section grid-bg" ref={ref}> <div className="container">


    <SectionTitle
      eyebrow="// TOOLS OF THE TRADE"
      title="Skills & Technologies"
      inView={inView}
    />

    <motion.div
      className="skills-grid"
      variants={staggerContainer(0.07, 0.15)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {SKILLS.map((skill) => (
        <SkillCard key={skill.name} skill={skill} />
      ))}
    </motion.div>

  </div>
</section>


)
}

export default Skills