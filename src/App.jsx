import React, { lazy, Suspense, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import Galaxy from './components/three/Galaxy'
import AIChatbot from './components/AIChatbot'

const LiveClock = lazy(() => import('./components/LiveClock'))

const About = lazy(() => import('./components/About'))
const Stats = lazy(() => import('./components/Stats'))
const Participants = lazy(() => import('./components/Participants'))
const Tracks = lazy(() => import('./components/Tracks'))
const Timeline = lazy(() => import('./components/Timeline'))
const Prizes = lazy(() => import('./components/Prizes'))
const FAQ = lazy(() => import('./components/FAQ'))
const Register = lazy(() => import('./components/Register'))
const Footer = lazy(() => import('./components/Footer'))

const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 rounded-full border-2 border-neon-purple border-t-transparent animate-spin" />
  </div>
)

export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem('hackorbit_theme')
    if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <>
      <Galaxy />
      <Cursor />
      <ScrollProgress />
      <AIChatbot />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<Spinner />}><About /></Suspense>
        <Suspense fallback={<Spinner />}><Stats /></Suspense>
        <Suspense fallback={<Spinner />}>
          <div className="max-w-sm mx-auto px-4 pb-8">
            <LiveClock />
          </div>
        </Suspense>
        <Suspense fallback={<Spinner />}><Participants /></Suspense>
        <Suspense fallback={<Spinner />}><Tracks /></Suspense>
        <Suspense fallback={<Spinner />}><Timeline /></Suspense>
        <Suspense fallback={<Spinner />}><Prizes /></Suspense>
        <Suspense fallback={<Spinner />}><FAQ /></Suspense>
        <Suspense fallback={<Spinner />}><Register /></Suspense>
      </main>
      <Suspense fallback={<Spinner />}><Footer /></Suspense>
    </>
  )
}
