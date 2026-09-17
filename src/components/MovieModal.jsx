import { useEffect, useState } from 'react'
import { movieDetails, movieCredits, img as tmdbImg } from '../api/tmdb.js'

function MovieModal({ movie, onClose }) {
  const [cast, setCast] = useState([])
  const [crew, setCrew] = useState([])
  const [backdrop, setBackdrop] = useState('')
  const [seasons, setSeasons] = useState([])
  const [extraGenres, setExtraGenres] = useState([])
  const [runtime, setRuntime] = useState(null)

  const id = movie?.id
  const isTmdb = movie?.source === 'tmdb'

  // load extra info for this show
  useEffect(() => {
    if (!id) return
    setCast([])
    setCrew([])
    setBackdrop('')
    setSeasons([])
    setExtraGenres([])
    setRuntime(null)

    // real movie from tmdb
    if (movie.source === 'tmdb') {
      setBackdrop(movie.backdrop || '')
      movieDetails(movie.tmdbId)
        .then((d) => {
          setRuntime(d.runtime)
          setExtraGenres((d.genres || []).map((g) => g.name))
        })
        .catch(() => {})
      movieCredits(movie.tmdbId)
        .then((d) => {
          setCast(
            d.cast.slice(0, 6).map((c) => ({
              person: { id: c.id, name: c.name, image: c.profile_path ? { medium: tmdbImg('w185', c.profile_path) } : null },
              character: { name: c.character },
            }))
          )
          setCrew(d.crew.filter((c) => c.job === 'Director').map((c) => ({ type: 'Director', person: { name: c.name } })))
        })
        .catch(() => {})
      return
    }

    fetch(`https://api.tvmaze.com/shows/${id}/cast`)
      .then((res) => res.json())
      .then((data) => setCast(data.slice(0, 6)))
      .catch(() => {})

    fetch(`https://api.tvmaze.com/shows/${id}/crew`)
      .then((res) => res.json())
      .then((data) => setCrew(data.slice(0, 4)))
      .catch(() => {})

    fetch(`https://api.tvmaze.com/shows/${id}/images`)
      .then((res) => res.json())
      .then((data) => {
        const bg =
          data.find((i) => i.type === 'background') ||
          data.find((i) => i.type === 'banner') ||
          data[0]
        if (bg) setBackdrop(bg.resolutions?.original?.url || bg.resolutions?.medium?.url || '')
      })
      .catch(() => {})

    fetch(`https://api.tvmaze.com/shows/${id}/seasons`)
      .then((res) => res.json())
      .then((data) => setSeasons(data))
      .catch(() => {})
  }, [id])

  // close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!movie) return null

  const img = movie.image?.original || movie.image?.medium || ''
  const rating = movie.rating?.average || 'N/A'
  const year = movie.premiered || 'Unknown'
  const genres = isTmdb
    ? extraGenres.length > 0 ? extraGenres.join(', ') : movie.genres.join(', ')
    : movie.genres && movie.genres.length > 0 ? movie.genres.join(', ') : 'N/A'
  const mins = movie.runtime || runtime || '?'

  // remove html tags from summary
  const cleanSummary = movie.summary
    ? movie.summary.replace(/<[^>]+>/g, '')
    : 'No summary available.'

  const totalEps = seasons.reduce((sum, s) => sum + (s.episodeOrder || 0), 0)
  const directors = crew.filter((c) => c.type && c.type.toLowerCase().includes('director'))
  const makers = directors.length > 0 ? directors : crew.filter((c) => c.type === 'Creator')

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={movie.name} onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" aria-label="Close details" onClick={onClose}>✕</button>

        {/* real backdrop from gallery, poster as fallback */}
        {backdrop || img ? (
          <img src={backdrop || img} alt={movie.name} className="modal-img" />
        ) : (
          <div className="modal-backup">No Image</div>
        )}

        <div className="modal-body">
          <h2>{movie.name}</h2>
          <p className="modal-info">
            ⭐ Rating: {rating} &nbsp; | &nbsp; 📅 Release: {year}
          </p>
          <p className="modal-info small">
            🎭 Genre: {genres} &nbsp; • &nbsp; 🌍 {movie.language || 'N/A'} &nbsp; • &nbsp; ⏱ {mins} min
          </p>

          {isTmdb ? (
            <p className="modal-info small">
              🎬 Movie • Status: {movie.status || 'Released'}
            </p>
          ) : seasons.length > 0 && (
            <p className="modal-info small">
              📺 {seasons.length} Season{seasons.length > 1 ? 's' : ''} • {totalEps} Episodes • Status: {movie.status || 'N/A'}
            </p>
          )}

          <h4>Overview:</h4>
          <p className="modal-summary">{cleanSummary}</p>

          {/* top cast */}
          {cast.length > 0 && (
            <div className="cast-box">
              <h4>Top Cast:</h4>
              <div className="cast-row">
                {cast.map((c) => (
                  <div className="cast-one" key={c.person.id}>
                    <img
                      src={c.person.image?.medium || c.character.image?.medium || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='70' height='70'><rect width='100%' height='100%' fill='%23334155'/><text x='50%' y='55%' fill='%2394a3b8' font-size='24' text-anchor='middle'>?</text></svg>"}
                      alt={c.person.name}
                    />
                    <p className="cast-name">{c.person.name}</p>
                    <p className="cast-char">as {c.character.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* director / creators */}
          {makers.length > 0 && (
            <p className="modal-crew">
              🎬 {directors.length > 0 ? 'Director' : 'Created by'}: {makers.map((m) => m.person.name).join(', ')}
            </p>
          )}

          {movie.officialSite && (
            <a href={movie.officialSite} target="_blank" rel="noreferrer" className="site-link">
              Visit official site →
            </a>
          )}

          <div className="modal-actions">
            <button className="btn-close" onClick={onClose}>❌ Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal
