import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import MovieModal from '../components/MovieModal.jsx'

function Movies() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  // load all shows at first
  useEffect(() => {
    fetch('https://api.tvmaze.com/shows')
      .then((res) => {
        if (!res.ok) throw new Error('failed to load')
        return res.json()
      })
      .then((data) => {
        setMovies(data.slice(0, 48)) // only first 48 to keep page fast
        setLoading(false)
      })
      .catch(() => {
        setError('Something went wrong. Please try again later.')
        setLoading(false)
      })
  }, [])

  // live search - fetch as user types (with small delay)
  useEffect(() => {
    // skip first load, only run when user types
    if (search.trim() === '') return

    const timer = setTimeout(() => {
      setLoading(true)
      fetch(`https://api.tvmaze.com/search/shows?q=${search}`)
        .then((res) => res.json())
        .then((data) => {
          setMovies(data.map((item) => item.show))
          setLoading(false)
        })
        .catch(() => {
          setError('Search failed. Check your internet.')
          setLoading(false)
        })
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  // search function
  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim() === '') {
      // if empty, load default again
      setLoading(true)
      fetch('https://api.tvmaze.com/shows')
        .then((res) => res.json())
        .then((data) => {
          setMovies(data.slice(0, 48))
          setLoading(false)
        })
      return
    }

    setLoading(true)
    setError('')
    fetch(`https://api.tvmaze.com/search/shows?q=${search}`)
      .then((res) => res.json())
      .then((data) => {
        const onlyShows = data.map((item) => item.show)
        setMovies(onlyShows)
        setLoading(false)
      })
      .catch(() => {
        setError('Search failed. Check your internet.')
        setLoading(false)
      })
  }

  return (
    <div className="movies-page">
      <h2 className="page-title">Browse Movies</h2>
      <p className="page-sub">Search your favorite show or explore the list below.</p>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="🔍 Search for a movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="status">Loading movies...</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="status">No movies found. Try another name.</p>
      )}

      <div className="movie-grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} onDetails={setSelected} />
        ))}
      </div>

      {/* details popup */}
      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default Movies
