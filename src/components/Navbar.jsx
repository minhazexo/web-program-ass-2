import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

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
            href="https://github.com/minhazexo/web-program-ass-2"
            target="_blank"
            rel="noreferrer"
            className="nav-github"
          >
            GitHub
          </a>
          <a
            href="https://minhazexo.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="nav-creator"
          >
            Creator
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
