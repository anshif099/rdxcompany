import { useState } from 'react'
import './SiteHeader.css'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Works', href: '#work' },
  { label: 'Get a Quote', href: '#contact' },
  { label: 'Blog', href: '#ideas' },
  { label: 'Contact', href: '#contact' },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <header className="site-header">
      <div className="site-header__left">
        <a className="site-header__logo" href="#home" onClick={close}>
          RDX
        </a>
        <button className="site-header__menu" type="button" onClick={() => setOpen(true)}>
          Menu
        </button>
      </div>

      <a className="site-header__talk" href="#contact" onClick={close}>
        <span>Let's talk</span>
        <span aria-hidden="true">-&gt;</span>
      </a>

      <nav className={`site-nav ${open ? 'site-nav--open' : ''}`} aria-label="Primary">
        <a className="site-nav__logo" href="#home" onClick={close}>
          RDX
        </a>
        {navItems.map((item, index) => (
          <a
            className="site-nav__link"
            href={item.href}
            key={item.label}
            onClick={close}
            style={{ transitionDelay: open ? `${index * 55 + 100}ms` : '0ms' }}
          >
            {item.label}
          </a>
        ))}
        <button className="site-nav__close" type="button" onClick={close} aria-label="Close menu">
          x
        </button>
      </nav>
    </header>
  )
}
