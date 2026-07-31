import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Award, ShieldCheck, BadgeCheck } from 'lucide-react'

const CERTS = [
  {
    Icon: Award,
    num: '01',
    name: 'AWS Solutions Architect',
    short: 'AWS SAA',
    issuer: 'Amazon Web Services',
    year: '2025',
    cred: 'AWS-CERT-SAA-C03',
    desc: 'Designing scalable, resilient, cost-optimized cloud architectures.',
    color: 'var(--gold)',
  },
  {
    Icon: ShieldCheck,
    num: '02',
    name: 'Microsoft Azure Fundamentals',
    short: 'AZ-900',
    issuer: 'Microsoft',
    year: '2024',
    cred: 'AZ-900',
    desc: 'Core Azure services, solutions, and foundational cloud concepts.',
    color: 'var(--wine-bright)',
  },
  {
    Icon: BadgeCheck,
    num: '03',
    name: 'GitHub Fundamentals',
    short: 'GitHub Foundations',
    issuer: 'GitHub',
    year: '2024',
    cred: 'GH-FOUNDATIONS',
    desc: 'Version control, collaboration, and modern DevOps workflows.',
    color: 'var(--bone-2)',
  },
]

function CertCard({ cert, i }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 160, damping: 20 })
  const sy = useSpring(my, { stiffness: 160, damping: 20 })
  const rotateX = useTransform(sy, [0, 1], [9, -9])
  const rotateY = useTransform(sx, [0, 1], [-9, 9])

  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    mx.set(px)
    my.set(py)
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => { mx.set(0.5); my.set(0.5) }

  const Icon = cert.Icon
  return (
    <motion.div
      ref={ref}
      className="cert-card"
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ['--accent' ]: cert.color }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="cert-spotlight" />
      <div className="cert-top">
        <div className="cert-icon-badge" style={{ color: cert.color }}>
          <Icon size={20} />
        </div>
        <span className="cert-num">{cert.num}</span>
      </div>

      <h3 className="cert-title">{cert.name}</h3>
      <span className="cert-short mono" style={{ color: cert.color }}>{cert.short}</span>

      <div className="cert-divider" />

      <div className="cert-meta mono">
        <span>{cert.issuer}</span>
        <span>{cert.year}</span>
      </div>
      <div className="cert-cred mono">{cert.cred}</div>

      <p className="cert-desc">{cert.desc}</p>
    </motion.div>
  )
}

export default function Certifications() {
  return (
    <section id="certifications" className="section-border" style={{ position: 'relative', zIndex: 2 }}>
      <div className="bento-section-container">
        <motion.div
          className="section-eyebrow-bar"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <span className="mono" style={{ color: 'var(--smoke)' }}>03 — Credentials</span>
        </motion.div>

        <div className="cert-grid">
          {CERTS.map((cert, i) => <CertCard key={cert.num} cert={cert} i={i} />)}
        </div>
      </div>
    </section>
  )
}
