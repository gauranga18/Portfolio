import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { PROJECTS } from '../../utils/constants'
import SectionTitle from '../ui/SectionTitle'
import GlassCard from '../ui/GlassCard'
import { slideInLeft, slideInRight } from '../../utils/animations'
import './Projects.css'

const ProjectCard = ({ project, index, inView }) => {
  const isEven = index % 2 === 0
  const variant = isEven ? slideInLeft : slideInRight

  return (
    <motion.div
      className="project-card-wrap"
      variants={variant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.12 }}
    >
      <GlassCard className="project-card">
        {/* Number */}
        <span className="project-num" aria-hidden="true">{project.id}.</span>

        {/* Status badge */}
        {project.status && (
          <span className={`project-status badge project-status--${project.status.toLowerCase().replace(' ', '-')}`}>
            {project.status === 'WIP' ? '🚧 In Progress' : '✅ Complete'}
          </span>
        )}

        {/* Title */}
        <h3 className="project-title">{project.title}</h3>

        {/* Tech badges */}
        <div className="project-tech" aria-label="Technologies used">
          {project.tech.map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>

        {/* Description */}
        <p className="project-desc">{project.description}</p>

        {/* Links */}
        <div className="project-links">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            aria-label={`${project.title} GitHub repository`}
          >
            <FaGithub aria-hidden="true" />
            <span>GitHub</span>
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`${project.title} live demo`}
            >
              <FaExternalLinkAlt aria-hidden="true" />
              <span>Live Demo</span>
            </a>
          )}
        </div>

        {/* Decorative corner */}
        <div className="project-corner" aria-hidden="true" />
      </GlassCard>
    </motion.div>
  )
}

const Projects = () => {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="projects" className="projects section" ref={ref}>
      <div className="container">
        <SectionTitle
          eyebrow="// WHAT I'VE BUILT"
          title="Projects"
          subtitle="Things I've made that I'm proud of."
          inView={inView}
        />

        <div className="projects-list">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
