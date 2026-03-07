import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { PERSONAL } from '../../utils/constants'
import './Footer.css'

const Footer = () => (
  <footer className="footer" role="contentinfo">
    <div className="footer__inner container">
      <div className="footer__brand">
        <span className="footer-logo">SJ<span className="footer-dot">.</span></span>
        <p className="footer__tagline">Roots in Assam. Building the future.</p>
      </div>

      <div className="footer__socials" aria-label="Social links">
        <a href={PERSONAL.github}    target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href={PERSONAL.linkedin}  target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href={PERSONAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram />
        </a>
      </div>

      <p className="footer__copy">
        © {new Date().getFullYear()} Saurav Jyoti · Made with 🌿 from Assam
      </p>
    </div>
  </footer>
)

export default Footer
