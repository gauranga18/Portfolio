import { Suspense, lazy, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import './styles/globals.css'
import Loader  from './components/ui/Loader'
import Navbar  from './components/layout/Navbar'
import Footer  from './components/layout/Footer'
import Cursor  from './components/layout/Cursor'
import Hero    from './components/sections/Hero'
import About   from './components/sections/About'
import Skills  from './components/sections/Skills'
import Projects   from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Contact    from './components/sections/Contact'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <Cursor />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <>
            <Navbar />
            <main id="main-content" tabIndex={-1}>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Contact />
            </main>
            <Footer />
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
