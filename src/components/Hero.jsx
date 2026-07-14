import { useRef, useState, useEffect, useCallback } from 'react'
import heroVideo from '../assets/hero.mp4'
import nikeLogo from '../assets/nike.png'
import psLogo from '../assets/playstation.png'
import mcdonaldLogo from '../assets/mcdonald.svg'
import legoLogo from '../assets/lego.png'
import './Hero.css'

import imgUIUX from '../assets/ui and ux.jpg'
import imgDesignBranding from '../assets/design and branding.png'
import imgAdvertising from '../assets/advertising.webp'
import imgDigitalMarketing from '../assets/digital marketing.png'
import imgSEO from '../assets/seo and sem.jpg'
import imgWebDesign from '../assets/web design and development.jpg'
import imgSoftware from '../assets/software development.webp'
import imgEcommerce from '../assets/ecommerce.png'
import imgVideo from '../assets/video production.jpg'
import imgMobile from '../assets/mobile apps.jpg'
import imgContent from '../assets/content marketing.jpg'

const lerp = (a, b, t) => a + (b - a) * t

const companyServices = [
  { title: 'UI & UX DESIGN', meta: 'Digital Marketing Company Bangalore', img: imgUIUX },
  { title: 'DESIGN & BRANDING', meta: 'Digital Marketing agency Kochi', img: imgDesignBranding },
  { title: 'ADVERTISING', meta: 'Digital Marketing in Kochi', img: imgAdvertising },
  { title: 'DIGITAL MARKETING', meta: 'Digital Marketing Company', img: imgDigitalMarketing },
  { title: 'SEO & SEM', meta: 'Search visibility and paid growth', img: imgSEO },
  { title: 'WEB DESIGN & DEVELOPMENT', meta: 'Fast websites built to convert', img: imgWebDesign },
  { title: 'SOFTWARE DEVELOPMENT', meta: 'Custom tools and business platforms', img: imgSoftware },
  { title: 'ECOMMERCE', meta: 'Online stores for modern brands', img: imgEcommerce },
  { title: 'VIDEO PRODUCTION', meta: 'Content for campaigns and launches', img: imgVideo },
  { title: 'MOBILE APPS', meta: 'Mobile-first product experiences', img: imgMobile },
  { title: 'CONTENT MARKETING', meta: 'Stories, campaigns, and conversion content', img: imgContent },
]

export default function Hero() {
  /* ── Refs ── */
  const sectionRef   = useRef(null)
  const viewportRef  = useRef(null)
  const cubeRef      = useRef(null)
  const videoRef     = useRef(null)
  const blurVideoRef = useRef(null)
  const labelRef     = useRef(null)
  const rafRef       = useRef(null)
  const targetRot         = useRef({ x: 0, y: 0 })
  const currentRot        = useRef({ x: 0, y: 0 })
  const labelTarget       = useRef({ x: 0, y: 0 })
  const labelCurrent      = useRef({ x: 0, y: 0 })
  const scrollProgressRef = useRef(0)
  // tracks whether we've snapped the label to the cursor at least once
  const labelInitialized  = useRef(false)

  /* ── State ── */
  const [scrollProgress, setScrollProgress] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  // true = mouse is on the plain hero bg  →  show label
  const [labelVisible, setLabelVisible] = useState(false)

  /* ── Scroll Listener ── */
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const totalScroll = sectionRef.current.offsetHeight - window.innerHeight
      if (totalScroll <= 0) return
      const progress = -sectionRef.current.getBoundingClientRect().top / totalScroll
      const clamped = Math.min(Math.max(progress, 0), 1)
      scrollProgressRef.current = clamped
      setScrollProgress(clamped)
      if (clamped >= 0.995) setLabelVisible(false)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  /* ── Mouse move (whole section) ── */
  const handleMouseMove = useCallback((e) => {
    if (!viewportRef.current) return
    const rect = viewportRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    targetRot.current = {
      x: -((e.clientY - cy) / (rect.height / 2)) * 22,
      y:  ((e.clientX - cx) / (rect.width  / 2)) * 22,
    }
    labelTarget.current = { x: e.clientX, y: e.clientY }

    // First move ever → teleport label directly under cursor (no slide-in from 0,0)
    if (!labelInitialized.current) {
      labelCurrent.current = { x: e.clientX, y: e.clientY }
      labelInitialized.current = true
    }
  }, [])

  /* Show label only when over the non-interactive hero background */
  const handleHeroBgEnter = () => setLabelVisible(true)
  const handleHeroBgLeave = () => setLabelVisible(false)

  /* When mouse leaves the section entirely, reset everything */
  const handleSectionLeave = () => {
    setLabelVisible(false)
    targetRot.current   = { x: 0, y: 0 }
    // Reset so next re-entry snaps the label straight to cursor (no slide from old pos)
    labelInitialized.current = false
  }

  /* ── rAF animation loop ── */
  useEffect(() => {
    const tick = () => {
      currentRot.current.x = lerp(currentRot.current.x, targetRot.current.x, 0.08)
      currentRot.current.y = lerp(currentRot.current.y, targetRot.current.y, 0.08)
      if (cubeRef.current) {
        const progress = scrollProgressRef.current
        const ryScrollAngle = Math.min(progress / 0.55, 1) * 450
        cubeRef.current.style.transform =
          `perspective(900px) rotateX(${currentRot.current.x}deg) rotateY(${currentRot.current.y + ryScrollAngle}deg)`
      }
      labelCurrent.current.x = lerp(labelCurrent.current.x, labelTarget.current.x, 0.12)
      labelCurrent.current.y = lerp(labelCurrent.current.y, labelTarget.current.y, 0.12)
      if (labelRef.current) {
        labelRef.current.style.left = labelCurrent.current.x + 'px'
        labelRef.current.style.top  = labelCurrent.current.y + 'px'
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* ── Cube hover → full-page video bg (label stays visible over cube) ── */
  const handleCubeEnter = () => {
    // Only allow video play if we are not scrolled down
    if (scrollProgressRef.current > 0.1) return
    setVideoPlaying(true)
    setLabelVisible(true)    // keep label showing over cube
    videoRef.current?.play()
    blurVideoRef.current?.play()
  }
  const handleCubeLeave = () => {
    setVideoPlaying(false)
    setLabelVisible(true)    // label remains visible as cursor returns to bg
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    if (blurVideoRef.current) {
      blurVideoRef.current.pause()
      blurVideoRef.current.currentTime = 0
    }
  }

  // Calculate animated values for the "Who we are" background text & bottom-right text
  const p = scrollProgress
  
  // "Who we are" text transitions
  let textOpacity = 0
  let textBlur = 16
  let textTranslateY = 40

  if (p >= 0.05 && p < 0.20) {
    const factor = Math.min((p - 0.05) / 0.08, 1)
    textOpacity = factor
    textBlur = (1 - factor) * 16
    textTranslateY = (1 - factor) * 40
  } else if (p >= 0.20) {
    const factor = Math.min((p - 0.20) / 0.05, 1)
    textOpacity = 1 - factor
    textBlur = factor * 16
    textTranslateY = -factor * 60 // slide up
  }
  
  // Em-dash transition next to "Who we are"
  let dashOpacity = 0
  if (p >= 0.08 && p < 0.20) {
    dashOpacity = Math.min((p - 0.08) / 0.08, 1)
  } else if (p >= 0.20) {
    dashOpacity = 1 - Math.min((p - 0.20) / 0.05, 1)
  }

  // Bottom-right description text transitions
  let brOpacity = 0
  let brBlur = 16
  let brTranslateY = 40
  if (p >= 0.10 && p < 0.20) {
    const factor = Math.min((p - 0.10) / 0.08, 1)
    brOpacity = factor
    brBlur = (1 - factor) * 16
    brTranslateY = (1 - factor) * 40
  } else if (p >= 0.20) {
    const factor = Math.min((p - 0.20) / 0.05, 1)
    brOpacity = 1 - factor
    brBlur = factor * 16
    brTranslateY = -factor * 60
  }

  let l3Opacity = 0
  let l3Blur = 10
  let l3TranslateY = 20
  if (p >= 0.12 && p < 0.20) {
    const factor = Math.min((p - 0.12) / 0.06, 1)
    l3Opacity = factor
    l3Blur = (1 - factor) * 10
    l3TranslateY = (1 - factor) * 20
  } else if (p >= 0.20) {
    const factor = Math.min((p - 0.20) / 0.05, 1)
    l3Opacity = 1 - factor
    l3Blur = factor * 10
    l3TranslateY = -factor * 40
  }

  let cultureOpacity = 0
  let cultureBlur = 10
  let cultureTranslateY = 20
  if (p >= 0.14 && p < 0.20) {
    const factor = Math.min((p - 0.14) / 0.04, 1)
    cultureOpacity = factor
    cultureBlur = (1 - factor) * 10
    cultureTranslateY = (1 - factor) * 20
  } else if (p >= 0.20) {
    const factor = Math.min((p - 0.20) / 0.05, 1)
    cultureOpacity = 1 - factor
    cultureBlur = factor * 10
    cultureTranslateY = -factor * 40
  }

  // Cube scaling and fading out (starts fading out at p=0.20)
  let cubeOpacity = 1
  let cubeScale = 1
  if (p >= 0.20) {
    const factor = Math.min((p - 0.20) / 0.05, 1)
    cubeOpacity = 1 - factor
    cubeScale = 1 - (factor * 0.8) // shrink to 0.2 scale
  }

  // Intro Block transitions
  let introOpacity = 0
  let introTranslateY = 80
  if (p >= 0.25 && p < 0.40) {
    const factor = Math.min((p - 0.25) / 0.05, 1)
    introOpacity = factor
    introTranslateY = (1 - factor) * 80
  } else if (p >= 0.40) {
    const factor = Math.min((p - 0.40) / 0.05, 1)
    introOpacity = Math.max(0, 1 - factor)
    introTranslateY = -factor * 100
  }

  // Services Slider transitions (fades in at p = 0.40, translates horizontally from 0.45 to 0.95)
  let sliderOpacity = 0
  let sliderTranslateX = 100 // start off-screen right
  if (p >= 0.40 && p < 0.95) {
    sliderOpacity = Math.min((p - 0.40) / 0.05, 1)
  } else if (p >= 0.95) {
    sliderOpacity = Math.max(0, 1 - (p - 0.95) / 0.03)
  }
  
  if (p >= 0.45 && p < 0.95) {
    // scroll horizontally from 0vw to -1000vw
    const progress = (p - 0.45) / 0.50
    sliderTranslateX = - (progress * 1000) 
  } else if (p >= 0.95) {
    sliderTranslateX = -1000
  }

  // Calculate Active Index for Slider Cards
  // Total translation distance is 1000vw. Each card is spaced exactly 100vw apart.
  const activeIndex = Math.min(
    companyServices.length - 1,
    Math.max(0, Math.round(Math.abs(sliderTranslateX) / 100))
  )

  return (
    <section
      id="home"
      className={`rdx-hero ${scrollProgress > 0.5 ? 'rdx-hero--scrolled' : ''}`}
      style={{ '--scroll-progress': scrollProgress }}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleSectionLeave}
    >
      <span className="rdx-hero-about-anchor" aria-hidden="true" />

      {/* Fixed Viewport Container */}
      <div className="rdx-hero-viewport" ref={viewportRef}>
        {/* ── Blurred Ambient Video Background ── */}
        <video
          ref={blurVideoRef}
          className={`rdx-bg-video rdx-bg-video--blur ${videoPlaying ? 'rdx-bg-video--visible' : ''}`}
          src={heroVideo}
          muted
          loop
          playsInline
        />
        {/* ── Full-page background video (plays on cube hover) ── */}
        <video
          ref={videoRef}
          className={`rdx-bg-video ${videoPlaying ? 'rdx-bg-video--visible' : ''}`}
          src={heroVideo}
          muted
          loop
          playsInline
        />
        {/* Dark overlay so content remains readable over video */}
        <div className={`rdx-bg-overlay ${videoPlaying ? 'rdx-bg-overlay--active' : ''}`} />

        {/* ── Scroll-to-explore label (follows cursor, hides on UI elements) ── */}
        <div
          ref={labelRef}
          className={`scroll-label ${labelVisible ? 'scroll-label--visible' : ''}`}
          aria-hidden="true"
        >
          <span>Scroll to explore</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>


        {/* ── Background Blurred Text "Who we are" ── */}
        <div
          className="rdx-bg-text"
          style={{
            opacity: textOpacity,
            filter: `blur(${textBlur}px)`,
            transform: `translateY(${textTranslateY}px)`,
            visibility: textOpacity <= 0 ? 'hidden' : 'visible'
          }}
        >
          <span className="rdx-bg-text-word rdx-bg-text-word--1">Who </span>
          <span className="rdx-bg-text-word rdx-bg-text-word--2">we </span>
          <span className="rdx-bg-text-word rdx-bg-text-word--3">are</span>
          <span className="rdx-bg-text-dash" style={{ opacity: dashOpacity }}> —</span>
        </div>

        {/* ── Bottom Right Description Text ── */}
        <div
          className="rdx-hero-bottom-right"
          style={{
            opacity: brOpacity,
            filter: `blur(${brBlur}px)`,
            transform: `translateY(${brTranslateY}px)`,
            visibility: brOpacity <= 0 ? 'hidden' : 'visible'
          }}
        >
          <div className="rdx-br-title">We're RDX.</div>
          <div className="rdx-br-desc">
            We're a human-first,<br />
            AI-native design and<br />
            technology company.
          </div>
          <div
            className="rdx-br-extra"
            style={{
              opacity: l3Opacity,
              filter: `blur(${l3Blur}px)`,
              transform: `translateY(${l3TranslateY}px)`,
              transition: 'opacity 0.15s ease-out, filter 0.15s, transform 0.15s'
            }}
          >
            For over 25 years we've<br />
            helped organizations<br />
            navigate moments when<br />
            technology changes faster<br />
            than <span className="word-culture" style={{ opacity: cultureOpacity, filter: `blur(${cultureBlur}px)`, transform: `translateY(${cultureTranslateY}px)`, display: 'inline-block', transition: 'opacity 0.15s, filter 0.15s, transform 0.15s' }}>culture.</span>
          </div>
        </div>

        {/* ── Pinned Intro Block ── */}
        <div
          className="rdx-hero-outro-wrapper"
          style={{
            opacity: introOpacity,
            transform: `translateY(${introTranslateY}px)`,
            visibility: introOpacity <= 0 ? 'hidden' : 'visible'
          }}
        >
          <div className="rdx-hero-outro__heading">
            <p>RDX Company</p>
            <h2>Digital Advertising and Branding Company in Kochi</h2>
          </div>

          <div className="rdx-hero-outro__body">
            <p className="rdx-hero-outro__copy">
              Unlock the digital potential of your business with our integrated marketing solutions. From content creation to branding and advertising, we've got you covered. Let us help you attract and engage customers with our cutting-edge strategies. Elevate your online presence and watch your business soar to new heights.
            </p>
            <div className="rdx-hero-outro__tags" aria-label="RDX marketing tags">
              <span>#DigitalMarketingExperts</span>
              <span>#ResultsDriven</span>
            </div>
          </div>
        </div>

        {/* ── Horizontal Services Slider ── */}
        <div
          className="rdx-hero-slider-container"
          style={{
            opacity: sliderOpacity,
            visibility: sliderOpacity <= 0 ? 'hidden' : 'visible'
          }}
        >
          <div
            className="rdx-hero-slider-track"
            style={{ transform: `translateX(${sliderTranslateX}vw)` }}
          >
            {companyServices.map((service, index) => {
              const isActive = index === activeIndex
              return (
                <div
                  className={`rdx-hero-service-card ${isActive ? 'rdx-hero-service-card--active' : ''}`}
                  key={`${service.title}-${index}`}
                >
                  <div className="rdx-hero-service-card__img-container">
                    <img
                      className="rdx-hero-service-card__img"
                      src={service.img}
                      alt={service.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="rdx-hero-service-card__info">
                    <span className="rdx-hero-service-card__num">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="rdx-hero-service-card__title">{service.title}</h3>
                    <p className="rdx-hero-service-card__meta">{service.meta}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Transparent hero bg hit-area (shows label on plain bg hover) ── */}
        <div
          className="rdx-hero-bg-hit"
          onMouseEnter={handleHeroBgEnter}
          onMouseLeave={handleHeroBgLeave}
        />

        {/* ── Centre cube ── */}
        <div
          className="rdx-hero-center"
          style={{
            opacity: cubeOpacity,
            transform: `scale(${cubeScale})`,
            pointerEvents: cubeOpacity > 0.08 ? 'auto' : 'none',
            visibility: cubeOpacity <= 0 ? 'hidden' : 'visible'
          }}
        >
          <div
            className="rdx-cube-wrapper"
            onMouseEnter={handleCubeEnter}
            onMouseLeave={handleCubeLeave}
          >
            <div className="rdx-cube" ref={cubeRef}>
              <div className={`rdx-cube__face rdx-cube__face--front ${scrollProgress >= 0.38 ? 'rdx-cube__face--front-mcd' : ''}`}>
                {scrollProgress < 0.38 ? (
                  <span className="rdx-cube__name">RDX</span>
                ) : (
                  <img className="rdx-cube__mcd-img" src={mcdonaldLogo} alt="McDonald's" />
                )}
              </div>
              <div className="rdx-cube__face rdx-cube__face--back">
                <img className="rdx-cube__nike-img" src={nikeLogo} alt="Nike" />
              </div>
              <div className="rdx-cube__face rdx-cube__face--left">
                {scrollProgress < 0.45 ? (
                  <span className="rdx-cube__google-name">Google</span>
                ) : (
                  <img className="rdx-cube__lego-img" src={legoLogo} alt="Lego" />
                )}
              </div>
              <div className="rdx-cube__face rdx-cube__face--right">
                <img className="rdx-cube__ps-img" src={psLogo} alt="PlayStation" />
              </div>
              <div className="rdx-cube__face rdx-cube__face--top" />
              <div className="rdx-cube__face rdx-cube__face--bottom" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
