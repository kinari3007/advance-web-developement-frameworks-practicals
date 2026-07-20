import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import GradientBackground from './components/GradientBackground'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import SkillsPage from './pages/SkillsPage'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { portfolioData } from './data'
import './App.css'

function App() {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`app ${theme}`}>
      {/* Full-page gradient background (critical) */}
      <GradientBackground />
      
      {/* Navigation */}
      <NavBar theme={theme} toggleTheme={toggleTheme} />
      
      {/* Content */}
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer name={portfolioData.name} />
      </div>
    </div>
  )
}

export default App