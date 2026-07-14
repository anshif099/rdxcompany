import { useEffect, useRef, useState } from 'react'
import './Loader.css'

/**
 * Loader
 * ──────
 * Phase 0: 'counting' -> counts 0-100 on black bg. Shows "Hello" then "We are" (98-100%)
 * Phase 1: 'split' -> black panels slide left/right revealing the Hero page directly
 */
export default function Loader({ onComplete }) {
  const [count, setCount] = useState(0)
  const [loaderPhase, setLoaderPhase] = useState('counting') // 'counting' | 'split' | 'rotate' | 'launch'
  const startRef = useRef(null)
  const rafRef = useRef(null)

  // Phase 0: Count up 0 -> 100 in 3 seconds
  useEffect(() => {
    const DURATION = 3000

    const easeInOut = (t) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    const tick = (now) => {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(elapsed / DURATION, 1)
      const eased = easeInOut(t)
      const current = Math.round(eased * 100)

      setCount(current)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setLoaderPhase('split')
        }, 500)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Phase 1: Split transition -> directly launch the site
  useEffect(() => {
    if (loaderPhase === 'split') {
      const t = setTimeout(() => {
        onComplete?.()
      }, 1200) // 1s transition + 200ms delay
      return () => clearTimeout(t)
    }
  }, [loaderPhase, onComplete])

  return (
    <div className={`rdx-loader-container ${loaderPhase === 'counting' ? 'rdx-loader-container--counting' : ''}`}>
      {/* ── Overlay: Counting Screen & Sliding Split Panels ── */}
      {loaderPhase === 'counting' && (
        <div className="rdx-loader-badge">
          <span className="rdx-loader-badge__sq" />
          <span className="rdx-loader-badge__text">AI-native.</span>
        </div>
      )}

      {loaderPhase === 'counting' && (
        <div className="rdx-loader-percentage">
          {count}%
        </div>
      )}

      {/* Center text for Phase 0 */}
      {loaderPhase === 'counting' && (
        <div className="rdx-loader-fg-text">
          {count < 98 ? 'Hello' : 'We are'}
        </div>
      )}

      {/* Sliding panels for Phase 1+ */}
      <div className={`rdx-loader-panel rdx-loader-panel--left ${loaderPhase !== 'counting' ? 'rdx-loader-panel--gone' : ''}`}>
        {loaderPhase !== 'counting' && <div className="rdx-loader-panel__text">We</div>}
      </div>
      <div className={`rdx-loader-panel rdx-loader-panel--right ${loaderPhase !== 'counting' ? 'rdx-loader-panel--gone' : ''}`}>
        {loaderPhase !== 'counting' && <div className="rdx-loader-panel__text">are</div>}
      </div>
    </div>
  )
}
