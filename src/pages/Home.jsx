import Hero from '../components/Hero.jsx'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <Hero />

      {/* small features section, just to make home page nicer */}
      <section className="features">
        <h2>Why use MovieExplorer?</h2>
        <div className="feature-grid">
          <div className="feature">
            <span className="f-icon">🔍</span>
            <h3>Quick Search</h3>
            <p>Search any show title and get results instantly from TVMaze.</p>
          </div>
          <div className="feature">
            <span className="f-icon">🎞️</span>
            <h3>Details Modal</h3>
            <p>Click see details to read summary, rating, genre and more.</p>
          </div>
          <div className="feature">
            <span className="f-icon">📱</span>
            <h3>Fully Responsive</h3>
            <p>Works nicely on mobile, tablet and desktop screens.</p>
          </div>
        </div>
        <Link to="/movies" className="btn-main center-btn">Browse All Movies</Link>
      </section>
    </div>
  )
}

export default Home
