import { useEffect, useState } from 'react'
import Hero from '../components/Hero.jsx'
import MovieModal from '../components/MovieModal.jsx'
import { Link } from 'react-router-dom'

function Home() {
  const [today, setToday] = useState([])
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [selected, setSelected] = useState(null)

  // what is airing today (US schedule)
  useEffect(() => {
    fetch('https://api.tvmaze.com/schedule')
      .then((res) => res.json())
      .then((data) => setToday(data.slice(0, 12)))
      .catch(() => {})
  }, [])

  // trending by popularity weight, top rated by score
  useEffect(() => {
    fetch('https://api.tvmaze.com/shows')
      .then((res) => res.json())
      .then((data) => {
        const withImg = data.filter((s) => s.image?.medium)
        setTrending([...withImg].sort((a, b) => (b.weight || 0) - (a.weight || 0)).slice(0, 10))
        setTopRated(
          withImg
            .filter((s) => s.rating?.average)
            .sort((a, b) => b.rating.average - a.rating.average)
            .slice(0, 12)
        )
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <Hero onMore={setSelected} />

      {/* trending with big rank numbers */}
      {trending.length > 0 && (
        <section className="rail">
          <h2>🔥 Trending Now</h2>
          <div className="rail-row">
            {trending.map((s, i) => (
              <div className="rank-card" key={s.id} onClick={() => setSelected(s)}>
                <span className="rank-num">{i + 1}</span>
                <img src={s.image.medium} alt={s.name} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* top rated posters */}
      {topRated.length > 0 && (
        <section className="rail">
          <h2>⭐ Top Rated</h2>
          <div className="rail-row">
            {topRated.map((s) => (
              <div className="rail-card" key={s.id} onClick={() => setSelected(s)}>
                <img src={s.image.medium} alt={s.name} loading="lazy" />
                <p>{s.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* airing today strip */}
      {today.length > 0 && (
        <section className="today">
          <h2>📺 Airing Today</h2>
          <p className="today-sub">Fresh episodes on US TV today.</p>
          <div className="today-strip">
            {today.map((ep) => (
              <div className="today-item" key={ep.id}>
                <img
                  src={ep.show.image?.medium || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='90' height='120'><rect width='100%' height='100%' fill='%23334155'/><text x='50%' y='55%' fill='%2394a3b8' font-size='20' text-anchor='middle'>?</text></svg>"}
                  alt={ep.show.name}
                />
                <div className="today-info">
                  <p className="today-show">{ep.show.name}</p>
                  <p className="today-ep">
                    S{ep.season} E{ep.number} • {ep.airtime || '??:??'}
                  </p>
                  <p className="today-name">{ep.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default Home
