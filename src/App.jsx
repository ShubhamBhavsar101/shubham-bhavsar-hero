import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useInView, animate, useScroll, useTransform } from 'framer-motion'
import {
  ArrowUpRight, ArrowDown,
  GitBranch, Cpu, Layers, Cloud
} from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import Navbar from './components/Navbar'
import Certifications from './components/Certifications'
import ArchitectureSlider from './components/ArchitectureSlider'
import TopologyCanvas from './components/TopologyCanvas'
import TechStackMatrix from './components/TechStackMatrix'

/* ─── Marquee ─── */
const MARQUEE_ITEMS = [
  'AWS Cloud', 'Terraform', 'DevOps', 'CI/CD', 'Kubernetes',
  'GitHub Actions', 'Docker', 'Site Reliability', 'Datadog', 'Snyk',
]
function Marquee() {
  const track = useRef(null)
  useEffect(() => {
    const el = track.current
    if (!el) return
    let x = 0
    let raf
    const speed = 0.5
    const total = el.scrollWidth / 2

    let visible = true
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0 }
    )
    io.observe(el)

    const tick = () => {
      if (visible) {
        x -= speed
        if (Math.abs(x) >= total) x = 0
        el.style.transform = `translateX(${x}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [])

  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="marquee-outer">
      <div ref={track} className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Animated Counter ─── */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [val, setVal] = useState('0')
  useEffect(() => {
    if (!inView) return
    const isFloat = String(to).includes('.')
    const ctrl = animate(0, parseFloat(to), {
      duration: 1.8, ease: 'easeOut',
      onUpdate: v => setVal(isFloat ? v.toFixed(2) : Math.floor(v).toString())
    })
    return () => ctrl.stop()
  }, [inView, to])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Custom Cursor ─── */
function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    let ringX = 0, ringY = 0
    let dotX = 0, dotY = 0
    let raf

    const onMove = e => {
      dotX = e.clientX
      dotY = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      ringX += (dotX - ringX) * 0.12
      ringY += (dotY - ringY) * 0.12
      if (dot.current) {
        dot.current.style.left = dotX + 'px'
        dot.current.style.top = dotY + 'px'
      }
      if (ring.current) {
        ring.current.style.left = ringX + 'px'
        ring.current.style.top = ringY + 'px'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onOver = e => {
      if (e.target.closest('a, button, [data-hover]')) ring.current?.classList.add('hover')
      else ring.current?.classList.remove('hover')
    }
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}

/* ─── Magnetic Button ─── */
function MagBtn({ children, className, href, target, rel, onClick }) {
  const ref = useRef(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })
  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25)
    y.set((e.clientY - r.top - r.height / 2) * 0.25)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  const handleClick = e => {
    if (onClick) onClick(e)
    if (href && href.startsWith('#')) {
      e.preventDefault()
      if (window.__lenis) {
        window.__lenis.scrollTo(href, { offset: href === '#about' ? 0 : -80 })
      } else {
        const target = document.querySelector(href)
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
  const Tag = href ? motion.a : motion.button
  return (
    <Tag ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} onClick={handleClick}
      className={className} href={href} target={target} rel={rel}>
      {children}
    </Tag>
  )
}

/* ─── Typewriter ─── */
const WORDS = ['Infrastructure.', 'DevOps.', 'Site Reliability.']
function TypewriterWord() {
  const [idx, setIdx] = useState(0)
  const [chars, setChars] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const w = WORDS[idx]; let t
    if (!del && chars < w.length) t = setTimeout(() => setChars(c => c + 1), 75)
    else if (!del && chars === w.length) t = setTimeout(() => setDel(true), 2200)
    else if (del && chars > 0) t = setTimeout(() => setChars(c => c - 1), 38)
    else { setDel(false); setIdx(i => (i + 1) % WORDS.length) }
    return () => clearTimeout(t)
  }, [chars, del, idx])
  return (
    <span className="serif-it">
      {WORDS[idx].slice(0, chars) || ' '}
      <span style={{
        display: 'inline-block', width: 3, height: '0.75em',
        background: 'var(--gold)',
        marginLeft: 5, verticalAlign: 'middle',
        animation: 'cursorBlink 0.75s step-end infinite',
        borderRadius: 0
      }} />
    </span>
  )
}

/* ─── Preloader ─── */
function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  const [out, setOut] = useState(false)
  useEffect(() => {
    const iv = setInterval(() => {
      setCount(p => {
        const n = p + Math.ceil(Math.random() * 5)
        if (n >= 100) { clearInterval(iv); setTimeout(() => { setOut(true); onDone() }, 500); return 100 }
        return n
      })
    }, 28)
    return () => clearInterval(iv)
  }, [onDone])
  return (
    <div className={`preloader${out ? ' hidden' : ''}`}>
      <motion.div className="preloader-title"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Shubham Bhavsar
      </motion.div>
      <div className="preloader-bar">
        <div className="preloader-bar-fill" style={{ width: `${count}%` }} />
      </div>
      <div className="mono" style={{ color: 'var(--smoke)', marginTop: 16 }}>
        {count}%
      </div>
    </div>
  )
}

/* ─── DATA ─── */
const CAPABILITIES = [
  {
    Icon: Cloud, num: '01', title: 'AWS Cloud Infrastructure',
    desc: 'Designing fault-tolerant AWS environments: VPCs, ECS Fargate clusters, serverless Lambdas, and highly available Aurora/RDS databases with optimized routing.',
    tags: ['AWS', 'ECS', 'Lambda', 'RDS', 'API Gateway'], color: 'var(--gold)',
  },
  {
    Icon: Cpu, num: '02', title: 'Infrastructure as Code',
    desc: 'Building reusable, modular Terraform architectures. Transitioning manual ops into version-controlled, auditable, automated deployments across Dev, Staging, and Prod.',
    tags: ['Terraform', 'State Management', 'Modular IaC'], color: 'var(--wine-bright)',
  },
  {
    Icon: GitBranch, num: '03', title: 'CI/CD & DevOps Automation',
    desc: 'Engineering end-to-end GitOps pipelines via GitHub Actions and Jenkins. Integrating CodeScene, Ruff, and Snyk security scanning at every gate.',
    tags: ['GitHub Actions', 'Jenkins', 'Snyk', 'Docker'], color: 'var(--bone-2)',
  },
  {
    Icon: Layers, num: '04', title: 'Observability & Optimization',
    desc: 'Enhancing system visibility with Datadog and CloudWatch. Right-sizing MSK clusters and optimizing Lambda runtimes to cut AWS costs and latency.',
    tags: ['Datadog', 'CloudWatch', 'Cost Optimization'], color: 'var(--smoke)',
  },
]

const PROJECTS = [
  {
    num: '01', title: 'International Airlines Group', subtitle: 'Sr DevOps Engineer · TCS',
    stack: ['Terraform', 'AWS ECS', 'GitHub Actions', 'Datadog'], impact: 'AWS & IaC', year: '2025–Now',
    link: 'https://github.com/ShubhamBhavsar101', color: 'var(--gold)',
    desc: 'Architected reusable Terraform modules, implemented rolling ECS Fargate deployments, designed least-privilege IAM policies, and configured GitHub Actions CI/CD integrating Ruff, Snyk, and ECR.',
    results: [
      'Reusable Terraform modules across Dev, Staging & Prod',
      'Rolling ECS Fargate deployments with zero downtime',
      'Least-privilege IAM design for every service account',
      'GitHub Actions CI/CD with Ruff, Snyk & ECR gates',
    ],
  },
  {
    num: '02', title: 'American International Group', subtitle: 'DevOps Engineer · TCS',
    stack: ['Jenkins', 'Docker', 'Snyk', 'SonarQube'], impact: '25% Faster CI/CD', year: '2022–2024',
    link: 'https://github.com/ShubhamBhavsar101', color: 'var(--wine-bright)',
    desc: 'Integrated DevSecOps pipelines with Snyk and SonarQube quality gates. Optimized build caching and parallel job execution, reducing average pipeline runtime by 25%.',
    results: [
      'DevSecOps pipelines with Snyk & SonarQube quality gates',
      'Optimized build caching across every pipeline stage',
      'Parallel job execution to remove idle wait time',
      'Reduced average pipeline runtime by 25%',
    ],
  },
]

const CASE_STUDY = {
  period: '2023–2024',
  title: 'Infrastructure',
  titleAccent: 'Optimization',
  subtitle: 'Cloud Cost & Performance',
  context: [
    'A self-managed MSK (Kafka) cluster and a fast-growing fleet of Lambda functions were driving AWS spend upward while deployments slowed down. I led a focused optimization initiative spanning compute right-sizing, deployment strategy, and API latency.',
    'Every change was driven by Datadog telemetry — mapping actual utilization against provisioned capacity, so spend followed real workload patterns rather than guesswork.',
  ],
  approach: [
    {
      n: '01',
      title: 'Right-sized the MSK cluster',
      desc: 'Analyzed broker CPU, memory, and storage utilization in Datadog, then resized the cluster to match actual workload — eliminating idle brokers and over-provisioned storage that were inflating the bill.',
    },
    {
      n: '02',
      title: 'Zip-based Lambda deployments',
      desc: 'Replaced heavy container-based packaging with zip deployments. Smaller artifacts meant faster uploads, quicker cold-starts, and a 50% reduction in deploy time.',
    },
    {
      n: '03',
      title: 'Added an in-memory cache',
      desc: 'Introduced caching on the hottest API paths so repeated compute was skipped entirely. The same infrastructure now served 10× the throughput.',
    },
  ],
  metrics: [
    { to: 50, suffix: '%', label: 'AWS Cost Reduced' },
    { to: 10, suffix: '×', label: 'API Throughput Boost' },
    { to: 50, suffix: '%', label: 'Faster Deploys' },
  ],
  stack: ['AWS MSK', 'Lambda', 'Datadog', 'API Gateway', 'Caching'],
}

/* ─── Framer Variants ─── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }

/* ─── Letter reveal variant ─── */
const letterContainer = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } } }
const letterVariant = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  show:   { opacity: 1, y: 0,  rotateX: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

function SplitWord({ word, className }) {
  return (
    <motion.span
      variants={letterContainer}
      style={{ display: 'block', perspective: 600 }}
      className={className}
    >
      {word.split('').map((ch, i) => (
        <motion.span key={i} variants={letterVariant} style={{ display: 'inline-block' }}>
          {ch}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* ─── APP ─── */
export default function App() {
  const [ready, setReady] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const labelOpacity = useTransform(scrollYProgress, [0.45, 0.65], [1, 0])

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = `@keyframes cursorBlink{from,to{opacity:1}50%{opacity:0}}`
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [])

  return (
    <>
      <Preloader onDone={() => setReady(true)} />

      {/* Vignette only — no grain */}
      <div className="vignette" />
      <CustomCursor />

      <Navbar />

      {/* ════════════════════════════ HERO ════════════════════════════ */}
      <section id="about" ref={heroRef} className="section-border" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-beam" />

        {/* Corner Labels — fade as user scrolls */}
        <motion.div
          className="mono"
          style={{
            position: 'absolute', top: '7rem', left: 'clamp(1.25rem, 3.5vw, 4rem)',
            color: 'var(--smoke)', opacity: labelOpacity, zIndex: 3, pointerEvents: 'none'
          }}
          initial={{ opacity: 0 }} animate={ready ? { opacity: 0.75 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Portfolio — Vol. 01
        </motion.div>

        <motion.div
          className="mono"
          style={{
            position: 'absolute', top: '7rem', right: 'clamp(1.25rem, 3.5vw, 4rem)',
            color: 'var(--smoke)', opacity: labelOpacity, zIndex: 3, pointerEvents: 'none'
          }}
          initial={{ opacity: 0 }} animate={ready ? { opacity: 0.75 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          DevOps / SRE Engineer
        </motion.div>
        <div className="hero-container">
          <motion.div variants={stagger} initial="hidden" animate={ready ? 'show' : 'hidden'}>

            <motion.div variants={fadeUp} className="hero-badge-pill">
              <span className="status-pulse-dot" />
              Open for full-time &amp; consulting — Pune, India
            </motion.div>

            <motion.h1 variants={stagger} className="hero-title-giant">
              <SplitWord word="Shubham" />
              <SplitWord word="Bhavsar" />
              <motion.span variants={fadeUp} style={{ display: 'block' }} className="hero-title-muted">
                Ships Cloud,
              </motion.span>
              <motion.span variants={fadeUp} style={{ display: 'block' }}>
                <TypewriterWord />
              </motion.span>
            </motion.h1>

            <motion.p variants={fadeUp} className="hero-lead-paragraph">
              DevOps / SRE Engineer with 4 years automating AWS infrastructure, CI/CD pipelines,
              and Terraform-driven IaC — improving speed, observability, and reducing operational costs in production.
            </motion.p>

            <motion.div variants={fadeUp} className="hero-cta-flex">
              <MagBtn className="btn-luxe-primary" href="https://github.com/ShubhamBhavsar101" target="_blank" rel="noreferrer">
                Explore Work <ArrowUpRight size={14} />
              </MagBtn>
              <MagBtn className="btn-luxe-secondary" href="#contact">
                Get in Touch <ArrowDown size={14} />
              </MagBtn>
            </motion.div>

            {/* Metrics Strip */}
            <motion.div variants={fadeUp} className="metrics-strip">
              {[
                { to: 4,  suf: '', label: 'Yrs DevOps / SRE' },
                { to: 50, suf: '%', label: 'AWS Cost Reduced' },
                { to: 25, suf: '%', label: 'Faster Pipelines' },
                { to: 3,  suf: '',  label: 'Certifications' },
              ].map((m, i) => (
                <div key={i} className="metric-item">
                  <div className="metric-value"><Counter to={m.to} suffix={m.suf} /></div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════ MARQUEE ════════════════════════════ */}
      <Marquee />

      {/* ════════════════════════════ CAPABILITIES ════════════════════════════ */}
      <section id="capabilities" className="section-border" style={{ position: 'relative', zIndex: 2 }}>
        <div className="bento-section-container">
          <motion.div
            className="section-eyebrow-bar"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <span className="mono" style={{ color: 'var(--smoke)' }}>01 — Expertise</span>
          </motion.div>

          <div className="capabilities-grid-2x2">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.Icon
              return (
                <div
                  key={i}
                  className="bento-card"
                >
                  <div>
                    <div className="bento-icon-badge" style={{ color: cap.color, borderColor: `rgba(232,228,220,0.15)` }}>
                      <Icon size={18} />
                    </div>
                    <div className="bento-num">{cap.num}</div>
                    <h3 className="bento-title">{cap.title}</h3>
                    <p className="bento-desc">{cap.desc}</p>
                  </div>
                  <div className="bento-tags">
                    {cap.tags.map((t, j) => (
                      <span key={j} className="bento-tag">{t}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Interactive Cloud Topology Canvas */}
          <TopologyCanvas />

          {/* Interactive Tech Stack Matrix */}
          <TechStackMatrix />
        </div>
      </section>

      {/* ════════════════════════════ PROJECTS ════════════════════════════ */}
      <section id="proofs" className="section-border" style={{ position: 'relative', zIndex: 2 }}>
        <div className="bento-section-container">
          <motion.div
            className="section-eyebrow-bar"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <span className="mono" style={{ color: 'var(--smoke)' }}>02 — Production Proof</span>
            <a href="https://github.com/ShubhamBhavsar101" target="_blank" rel="noreferrer">
              VIEW ALL →
            </a>
          </motion.div>

          <motion.div
            className="section-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="case-study-title">
              Client <span className="serif-it">Work</span>
            </h3>
            <p className="case-study-subtitle mono">Enterprise DevOps · TCS</p>
          </motion.div>

          <div className="projects-list-container">
            {PROJECTS.map((proj, i) => (
              <motion.a
                key={i}
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                className="project-list-item"
                data-hover
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="project-item-meta">
                  <span className="project-item-num">{proj.num}</span>
                  <span className="project-item-year">{proj.year}</span>
                </div>

                <div className="project-item-main">
                  <div className="project-item-header">
                    <h3 className="project-item-title">{proj.title}</h3>
                    <span className="project-item-subtitle">{proj.subtitle}</span>
                  </div>
                  <p className="project-item-desc">{proj.desc}</p>
                  <ul className="project-item-results">
                    {proj.results.map((r, j) => (
                      <li key={j} className="project-result-item">
                        <span className="project-result-dot" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="project-item-tags">
                    {proj.stack.map((t, j) => (
                      <span key={j} className="project-tag-pill">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="project-item-action">
                  <span className="project-impact-badge mono">{proj.impact}</span>
                  <div className="project-arrow-box">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Case Study — Infrastructure Optimization */}
          <motion.div
            className="case-study"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="case-study-head">
              <span className="mono" style={{ color: 'var(--gold)' }}>Case Study</span>
              <span className="mono" style={{ color: 'var(--smoke)' }}>{CASE_STUDY.period}</span>
            </div>

            <div className="case-study-grid">
              <div className="case-study-narrative">
                <h3 className="case-study-title">
                  {CASE_STUDY.title} <span className="serif-it">{CASE_STUDY.titleAccent}</span>
                </h3>
                <p className="case-study-subtitle mono">{CASE_STUDY.subtitle}</p>

                {CASE_STUDY.context.map((p, i) => (
                  <p key={i} className="case-study-para">{p}</p>
                ))}

                <div className="case-study-approach">
                  {CASE_STUDY.approach.map((step, i) => (
                    <div key={i} className="cs-step">
                      <span className="cs-step-num">{step.n}</span>
                      <div>
                        <h4 className="cs-step-title">{step.title}</h4>
                        <p className="cs-step-desc">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="case-study-side">
                <div className="cs-metrics">
                  {CASE_STUDY.metrics.map((m, i) => (
                    <div key={i} className="cs-metric">
                      <div className="cs-metric-value"><Counter to={m.to} suffix={m.suffix} /></div>
                      <div className="cs-metric-label">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="cs-tags">
                  {CASE_STUDY.stack.map((t, j) => (
                    <span key={j} className="bento-tag">{t}</span>
                  ))}
                </div>
              </aside>
            </div>

            {/* Interactive Architecture Before / After Slider */}
            <ArchitectureSlider />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════ CERTIFICATIONS ════════════════════════════ */}
      <Certifications />

      {/* ════════════════════════════ CONTACT ════════════════════════════ */}
      <section id="contact" style={{ position: 'relative', zIndex: 2 }}>
        <div className="bento-section-container">
          <motion.div
            className="section-eyebrow-bar"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <span className="mono" style={{ color: 'var(--smoke)' }}>04 — Contact</span>
          </motion.div>

          <motion.div
            className="contact-card-luxe"
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="contact-headline">
              Let's Build{' '}
              <span className="serif-it">Scalable</span>
              {' '}Cloud Systems Together.
            </h2>
            <p className="contact-subtext">
              Whether you need cloud architecture, a DevOps pipeline overhaul, Kubernetes consulting,
              or SRE engagement — let's talk.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: '3rem' }}>
              <MagBtn className="btn-luxe-primary" href="mailto:shubhamcbhavsar198@gmail.com">
                Send Email Brief <ArrowUpRight size={14} />
              </MagBtn>
              <MagBtn className="btn-luxe-secondary" href="https://www.linkedin.com/in/shubham-bhavsar-dev/" target="_blank" rel="noreferrer">
                Connect on LinkedIn <ArrowUpRight size={14} />
              </MagBtn>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px rgba(74,222,128,0.8)', display: 'inline-block' }} />
              <span className="mono" style={{ color: 'var(--smoke)' }}>Responding within 24 hrs · Pune, India (IST)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════ FOOTER ════════════════════════════ */}
      <footer className="site-footer-luxe">
        <span className="mono" style={{ color: 'var(--smoke-dim)' }}>
          © {new Date().getFullYear()} · Shubham Bhavsar
        </span>
        <ul style={{ display: 'flex', gap: 24, listStyle: 'none' }}>
          {[
            { label: 'GitHub',   href: 'https://github.com/ShubhamBhavsar101',           Icon: FaGithub },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shubham-bhavsar-dev/', Icon: FaLinkedinIn },
          ].map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer"
                className="mono" style={{ color: 'var(--smoke)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7, transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--bone)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--smoke)'}>
                <Icon size={13} /> {label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </>
  )
}
