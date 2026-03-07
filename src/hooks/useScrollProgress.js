import { useState, useEffect } from 'react'

export function useScrollProgress() {
  const [scrollY,    setScrollY]    = useState(0)
  const [progress,   setProgress]   = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollY(sy)
      setProgress(maxScroll > 0 ? sy / maxScroll : 0)
      setIsScrolled(sy > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY, progress, isScrolled }
}
