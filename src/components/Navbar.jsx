import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  // dark mode on by default, remember choice
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light')
  const location = useLocation()
  const navigate = useNavigate()

  // apply theme on body
  useEffect(() => {
    document.body.className = dark ? '' : 'light'
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  // navbar search -> go to movies page with query
  const goSearch = (e) => {
    e.preventDefault()
    navigate(`/movies?q=${text}`)
    setOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <img src="/icon.png" alt="logo" className="logo-img" /> MovieExplorer
        </Link>

        {/* simple mobile menu button */}
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${open ? 'show' : ''}`}>
          {/* search in navbar */}
          <form className="nav-search" onSubmit={goSearch}>
            <input
              type="text"
              placeholder="🔍 Search..."
              aria-label="Search shows"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">Go</button>
          </form>

          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link to="/movies" className="nav-btn" onClick={() => setOpen(false)}>
            Browse Movies
          </Link>
          <a
            href="https://minhazexo.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="nav-creator"
          >
            Creator
          </a>
          {/* light / dark toggle */}
          <button className="theme-btn" onClick={() => setDark(!dark)} title="Change theme" aria-label="Toggle light and dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
