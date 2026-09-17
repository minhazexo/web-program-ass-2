import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// big billboard hero, rotates through top rated shows
function Hero({ onMore }) {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  // pick top 5 rated shows + a wide backdrop for each
  useEffect(() => {
    fetch('https://api.tvmaze.com/shows')
      .then((res) => res.json())
      .then(async (data) => {
        const top = data
          .filter((s) => s.rating?.average && s.image)
          .sort((a, b) => b.rating.average - a.rating.average)
          .slice(0, 5)

        const withBg = await Promise.all(
          top.map(async (s) => {
            try {
              const imgs = await fetch(`https://api.tvmaze.com/shows/${s.id}/images`).then((r) => r.json())
              const bg = imgs.find((i) => i.type === 'background') || imgs.find((i) => i.type === 'banner')
              return { ...s, backdrop: bg?.resolutions?.original?.url || s.image.original }
            } catch {
              return { ...s, backdrop: s.image.original }
            }
          })
        )
        setSlides(withBg)
      })
      .catch(() => {})
  }, [])

  // auto rotate every 8 sec, pause on hover
  useEffect(() => {
    if (paused || slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 8000)
    return () => clearInterval(t)
  }, [paused, slides.length])

  // still loading - simple fallback so page is not empty
  if (slides.length === 0) {
    return (
      <header className="billboard">
        <div className="bill-content">
          <h1>DISCOVER MOVIES</h1>
          <p>Loading top picks...</p>
        </div>
      </header>
    )
  }

  const show = slides[current]
  const year = show.premiered ? show.premiered.slice(0, 4) : ''
  const desc = show.summary
    ? show.summary.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
    : ''

  return (
    <header
      className="billboard"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* backdrops, crossfade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={i === current ? 'slide on' : 'slide'}
          style={{ backgroundImage: `url(${s.backdrop})` }}
        />
      ))}
      <div className="scrim-top"></div>
      <div className="scrim-bottom"></div>

      <div className="bill-content">
        <p className="bill-badge">🔥 #{current + 1} Trending Today</p>
        <h1>{show.name}</h1>
        <p className="bill-meta">
          <span className="match">⭐ {show.rating.average}</span>
          <span>{year}</span>
          <span>{(show.genres || []).slice(0, 2).join(' • ')}</span>
        </p>
        <p className="bill-desc">{desc}</p>
        <div className="bill-btns">
          <button className="btn-play" onClick={() => onMore(show)}>
            ▶ See Details
          </button>
          <Link to="/movies" className="btn-glass">
            Browse All
          </Link>
        </div>
      </div>

      <button className="bill-arrow left" aria-label="Previous" onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}>‹</button>
      <button className="bill-arrow right" aria-label="Next" onClick={() => setCurrent((current + 1) % slides.length)}>›</button>

      <div className="bill-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={'Show ' + (i + 1)}
            className={i === current ? 'dot on' : 'dot'}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </header>
  )
}

export default Hero
