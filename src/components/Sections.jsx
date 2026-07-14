import { useEffect, useRef, useState } from 'react'
import heroVideo from '../assets/hero.mp4'
import box1 from '../assets/box1.webp'
import box2 from '../assets/box2.jpg'
import box3 from '../assets/box3.webp'
import box4 from '../assets/box4.png'
import box5 from '../assets/box5.png'
import box6 from '../assets/box6.webp'
import box7 from '../assets/box7.webp'
import box8 from '../assets/box8.png'
import box9 from '../assets/box9.webp'
import './Sections.css'

const services = [
  {
    number: '01',
    title: 'Brand strategy & design',
    image: box1,
    text: 'We turn positioning, identity, and launch systems into brands people can recognize and trust.',
  },
  {
    number: '02',
    title: 'Websites & digital products',
    image: box2,
    text: 'We design and build fast, expressive interfaces for companies that need their digital presence to work harder.',
  },
  {
    number: '03',
    title: 'AI automation & platforms',
    image: box3,
    text: 'We connect AI workflows, internal tools, and product logic so teams can move faster with less friction.',
  },
  {
    number: '04',
    title: 'Marketing & growth systems',
    image: box4,
    text: 'We create campaigns, funnels, and content engines that connect the brand promise to measurable demand.',
  },
]

const work = [
  {
    title: 'Launch-ready identity systems',
    label: 'Brand / Web / Motion',
    image: box6,
    text: 'A visual system built for companies moving from idea to public launch.',
  },
  {
    title: 'Commerce experiences that convert',
    label: 'Product / UX / Build',
    image: box7,
    text: 'Clean storefronts, confident product pages, and checkout paths shaped around customer decisions.',
  },
  {
    title: 'AI-native business dashboards',
    label: 'Automation / Data / Tools',
    image: box8,
    text: 'Operational views that help founders and teams see what matters without digging through scattered systems.',
  },
]

const ideas = [
  {
    type: 'Perspective.',
    title: 'AI should make teams sharper, not noisier.',
    cta: 'Read',
  },
  {
    type: 'Playbook.',
    title: 'How RDX thinks about websites that behave like products.',
    cta: 'Explore',
  },
  {
    type: 'Field note.',
    title: 'The best brand systems are built for repetition.',
    cta: 'Open',
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.75 6.1h11.26v11.26h-1.3V8.27L8.04 16.54l-.9-.94 8.59-8.2H6.75V6.1Z" />
    </svg>
  )
}

function SplitButton({ children, variant = 'dark', onClick, type = 'button' }) {
  return (
    <button className={`rdx-split-btn rdx-split-btn--${variant}`} type={type} onClick={onClick}>
      <span className="rdx-split-btn__face rdx-split-btn__face--front">
        <span>{children}</span>
        <ArrowIcon />
      </span>
      <span className="rdx-split-btn__face rdx-split-btn__face--bottom" aria-hidden="true">
        <span>{children}</span>
        <ArrowIcon />
      </span>
    </button>
  )
}

function SectionTitle({ eyebrow, title, text, inverse = false }) {
  return (
    <header className={`rdx-section-title ${inverse ? 'rdx-section-title--inverse' : ''}`}>
      <p>{eyebrow}</p>
      <div>
        <h2>{title}</h2>
        {text && <span>{text}</span>}
      </div>
    </header>
  )
}

export default function Sections() {
  const [showreelOpen, setShowreelOpen] = useState(false)
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)
  const modalVideoRef = useRef(null)
  const servicesPinRef = useRef(null)

  const closeShowreel = () => {
    modalVideoRef.current?.pause()
    setShowreelOpen(false)
  }

  useEffect(() => {
    if (!showreelOpen) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeShowreel()
    }

    document.body.style.overflow = 'hidden'
    document.body.classList.add('rdx-showreel-is-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('rdx-showreel-is-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showreelOpen])

  useEffect(() => {
    const section = servicesPinRef.current
    if (!section) return undefined

    let frameId = 0

    const updateActiveService = () => {
      frameId = 0

      const rect = section.getBoundingClientRect()
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)
      const nextIndex = Math.min(Math.floor(progress * services.length), services.length - 1)

      setActiveServiceIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex))
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateActiveService)
    }

    updateActiveService()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return (
    <main className="rdx-sections">
      <section className="rdx-showreel" id="showreel" data-component-name="section-show-reel">
        <div className="rdx-showreel__media" aria-hidden="true">
          <video src={heroVideo} muted loop playsInline autoPlay />
          <div />
        </div>
        <div className="rdx-showreel__content">
          <div className="rdx-showreel__eyebrow">
            <span>-</span>
            <span>64</span>
            <span>sec</span>
          </div>
          <h2>
            Future-defining
            <span>firsts.</span>
          </h2>
          <SplitButton variant="light" onClick={() => setShowreelOpen(true)}>
            Play
          </SplitButton>
        </div>
      </section>

      {showreelOpen && (
        <div
          className="rdx-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="RDX showreel"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeShowreel()
          }}
        >
          <button className="rdx-video-modal__close" type="button" onClick={closeShowreel}>
            <span>Close</span>
            <span aria-hidden="true">x</span>
          </button>
          <video ref={modalVideoRef} src={heroVideo} controls autoPlay playsInline />
        </div>
      )}

      <section
        className="rdx-services"
        id="services"
        data-component-name="section-services"
      >
        <div className="rdx-services__intro">
          <SectionTitle
            eyebrow="What we do"
            title="What we do -"
            text="RDX makes digital things that matter to businesses, to brands, and to the people they serve."
          />
        </div>

        <div className="rdx-services__pin" ref={servicesPinRef}>
          <div className="rdx-services__sticky">
            <div className="rdx-service-stage" aria-label="RDX services">
              <div className="rdx-service-rail" aria-hidden="true">
                {services.map((service, index) => (
                  <div
                    className={`rdx-service-step ${activeServiceIndex === index ? 'is-active' : ''}`}
                    key={service.number}
                  >
                    <span>{service.number}</span>
                    <strong>{service.title}</strong>
                  </div>
                ))}
              </div>

              <div className="rdx-service-cards">
                {services.map((service, index) => (
                  <article
                    className={`rdx-service-card ${activeServiceIndex === index ? 'is-active' : ''} ${
                      activeServiceIndex > index ? 'is-past' : ''
                    }`}
                    key={service.title}
                  >
                    <div className="rdx-service-card__head">
                      <span>{service.number}</span>
                      <h3>{service.title}</h3>
                    </div>
                    <div className="rdx-service-card__image">
                      <img src={service.image} alt="" loading="lazy" />
                    </div>
                    <p>{service.text}</p>
                    <SplitButton>Explore</SplitButton>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rdx-impact" aria-label="RDX capabilities">
        <div className="rdx-impact__row">
          <span>Strategy</span>
          <span>Design</span>
          <span>Technology</span>
          <span>AI</span>
          <span>Growth</span>
        </div>
        <div className="rdx-impact__grid">
          <div>
            <strong>25+</strong>
            <span>years of digital craft thinking inside the RDX promise.</span>
          </div>
          <div>
            <strong>01</strong>
            <span>partner from first idea to shipped product.</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>systems designed to keep learning after launch.</span>
          </div>
        </div>
      </section>

      <section className="rdx-work" id="work" data-component-name="section-work">
        <SectionTitle
          eyebrow="Selected work"
          title="Work that feels useful."
          text="A preview of the kind of brand, product, and AI systems RDX builds."
          inverse
        />

        <div className="rdx-work-grid">
          {work.map((project, index) => (
            <article className="rdx-work-card" key={project.title}>
              <img src={project.image} alt="" loading="lazy" />
              <div>
                <p>{project.label}</p>
                <h3>{project.title}</h3>
                <span>{project.text}</span>
              </div>
              <span className="rdx-work-card__number">{String(index + 1).padStart(2, '0')}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="rdx-lab" id="ideas" data-component-name="section-perspectives">
        <div className="rdx-lab__visual">
          <img src={box9} alt="" loading="lazy" />
          <img src={box5} alt="" loading="lazy" />
        </div>
        <div className="rdx-lab__copy">
          <p>Ideas</p>
          <h2>Thinking for companies building through change.</h2>
          <SplitButton>Explore thinking</SplitButton>
        </div>
        <div className="rdx-idea-track">
          {ideas.map((idea) => (
            <article className="rdx-idea-card" key={idea.title}>
              <p>{idea.type}</p>
              <h3>{idea.title}</h3>
              <SplitButton variant="outline">{idea.cta}</SplitButton>
            </article>
          ))}
        </div>
      </section>

      <footer className="rdx-footer" id="contact" data-component-name="footer">
        <div className="rdx-footer__intro">
          <h2>Get to know more about our work.</h2>
          <form className="rdx-footer__form">
            <label htmlFor="rdx-email">Email Address</label>
            <div>
              <input id="rdx-email" type="email" placeholder="Email" />
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>

        <nav className="rdx-footer__links" aria-label="Footer">
          <div>
            <h3>Channels</h3>
            <a href="#work">Work</a>
            <a href="#ideas">Ideas</a>
            <a href="#services">Services</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:business@rdx.com">Become a Client</a>
            <a href="mailto:press@rdx.com">Press Inquiries</a>
            <a href="mailto:hello@rdx.com">Everything Else</a>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#showreel">Showreel</a>
            <a href="#services">What we do</a>
            <a href="#contact">Careers</a>
          </div>
        </nav>

        <div className="rdx-footer__bottom">
          <p>Copyright 2026 RDX. All rights reserved.</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
          </button>
        </div>
      </footer>
    </main>
  )
}
