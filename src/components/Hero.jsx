import { Link } from 'react-router-dom'

function Hero() {
  return (
    <header className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-small">🎬 Welcome to MovieExplorer</p>
        <h1>DISCOVER MOVIES</h1>
        <p className="hero-text">
          Explore and discover your favorite movies from around the world.
          Search titles, check ratings and find your next watch.
        </p>
        <div className="hero-buttons">
          <Link to="/movies" className="btn-main">
            Explore Now
          </Link>
          <a href="https://www.tvmaze.com/api" target="_blank" rel="noreferrer" className="btn-second">
            API Info
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <h3>250+</h3>
            <span>Shows</span>
          </div>
          <div>
            <h3>Free</h3>
            <span>TVMaze API</span>
          </div>
          <div>
            <h3>Fast</h3>
            <span>Search</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
