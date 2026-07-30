import { motion } from 'framer-motion'
import {
  Mail,
  Box,
  Layers,
  Cloud,
  Code,
  GitBranch,
  Cpu
} from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

export default function ProfileCard() {
  const techStack = [
    { name: 'Docker', icon: Box },
    { name: 'Kubernetes', icon: Layers },
    { name: 'AWS Cloud', icon: Cloud },
    { name: 'React & Node', icon: Code },
    { name: 'CI/CD', icon: GitBranch },
    { name: 'AI Agents', icon: Cpu },
  ]

  return (
    <motion.div
      className="profile-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      whileHover={{ y: -8 }}
    >
      <div className="card-header-bar">
        <div className="window-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <span className="card-tag">DevOps & Full Stack</span>
      </div>

      <div className="avatar-wrapper">
        <div className="avatar-glow"></div>
        <div className="avatar-img">SB</div>
      </div>

      <div className="profile-info">
        <h2>Shubham Bhavsar</h2>
        <p>DevOps & Cloud Engineer | Full-Stack Architect</p>
      </div>

      <div className="tech-stack">
        {techStack.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="tech-pill">
              <Icon size={14} /> {item.name}
            </div>
          )
        })}
      </div>

      <div className="social-links">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn" title="GitHub">
          <FaGithub size={18} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" title="LinkedIn">
          <FaLinkedinIn size={18} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" title="Twitter">
          <FaXTwitter size={18} />
        </a>
        <a href="mailto:shubham@example.com" className="social-btn" title="Email">
          <Mail size={18} />
        </a>
      </div>
    </motion.div>
  )
}
