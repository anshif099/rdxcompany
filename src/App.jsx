import { useState } from 'react'
import Loader from './components/Loader'
import SiteHeader from './components/SiteHeader'
import Hero   from './components/Hero'
import CompanyIntro from './components/CompanyIntro'
import Sections from './components/Sections'
import './App.css'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {/* Loader sits on top; calls onComplete when bars slide off */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      <SiteHeader />

      {/* Hero is mounted immediately so assets pre-load behind the loader */}
      <Hero />
      <CompanyIntro />
      <Sections />
    </>
  )
}
