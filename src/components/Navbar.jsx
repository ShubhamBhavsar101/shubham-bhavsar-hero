export default function Navbar() {
  return (
    <header className="site-header">
      <a href="#" className="brand-mark">
        <div className="brand-icon-hex">S</div>
        <span className="brand-text">Shubham Bhavsar</span>
      </a>

      <ul className="header-nav">
        <li><a href="#about">About</a></li>
        <li><a href="#capabilities">Expertise</a></li>
        <li><a href="#proofs">Work</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <a href="mailto:shubhamcbhavsar198@gmail.com" className="btn-cmd-k">
        Hire Me
      </a>
    </header>
  )
}
