import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BlueprintMode from './BlueprintMode'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = [
    { label: 'About',    href: '#about' },
    { label: 'Expertise', href: '#capabilities' },
    { label: 'Work',     href: '#proofs' },
    { label: 'Certs',    href: '#certifications' },
    { label: 'Contact',  href: '#contact' },
  ]

  const handleNav = (e, href) => {
    e.preventDefault()
    setOpen(false)
    if (window.__lenis) {
      window.__lenis.scrollTo(href, { offset: href === '#about' ? 0 : -80 })
    } else {
      const target = document.querySelector(href)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className="site-header"
        style={{
          mixBlendMode: open || scrolled ? 'normal' : 'difference',
          background: scrolled ? 'rgba(10,9,8,0.97)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(232,228,220,0.08)' : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <a href="#" className="brand-mark" onClick={e => handleNav(e, '#about')} style={{ color: scrolled || open ? 'var(--bone)' : 'white' }}>
          <div className="brand-icon-hex" style={{ color: scrolled || open ? 'var(--bone)' : 'white', borderColor: scrolled || open ? 'rgba(232,228,220,0.4)' : 'rgba(255,255,255,0.4)' }}>S</div>
          <span className="brand-text" style={{ color: scrolled || open ? 'var(--bone)' : 'white' }}>Shubham Bhavsar</span>
        </a>

        <ul className="header-nav">
          {links.map(({ label, href }) => (
            <li key={label}><a href={href} onClick={e => handleNav(e, href)}>{label}</a></li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BlueprintMode />
          <a href="mailto:shubhamcbhavsar198@gmail.com" className="btn-cmd-k">
            Hire Me
          </a>

          {/* Hamburger — only visible on mobile */}
          <button
            className="hamburger-btn"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className={`hamburger-line ${open ? 'open' : ''}`} />
            <span className={`hamburger-line ${open ? 'open' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="mobile-nav">
              {links.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  className="mobile-nav-link"
                  onClick={e => handleNav(e, href)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="mono" style={{ color: 'var(--smoke)', fontSize: '0.6rem' }}>0{i + 1}</span>
                  {label}
                </motion.a>
              ))}
            </nav>
            <a
              href="mailto:shubhamcbhavsar198@gmail.com"
              className="btn-luxe-primary mobile-drawer-cta"
              onClick={() => setOpen(false)}
            >
              Hire Me <span>↗</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
