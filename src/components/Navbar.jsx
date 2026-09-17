import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span> MovieExplorer
        </Link>

        {/* simple mobile menu button */}
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${open ? 'show' : ''}`}>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/movies"
            className={location.pathname === '/movies' ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            Movies
          </Link>
          <Link to="/movies" className="nav-btn" onClick={() => setOpen(false)}>
            Browse Movies
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
