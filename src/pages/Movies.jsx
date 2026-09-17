import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard.jsx'
import MovieModal from '../components/MovieModal.jsx'
import { popularMovies, searchMovies, getGenres, toCard } from '../api/tmdb.js'

const PER_PAGE = 24 // items per page for series + actors

function Movies() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [movies, setMovies] = useState([]) // tmdb movies (one page at a time)
  const [series, setSeries] = useState([]) // tvmaze scripted shows (full list)
  const [people, setPeople] = useState([]) // tvmaze actors (full list)
  const [search, setSearch] = useState(q)
  const [mode, setMode] = useState('movies') // movies, series or people
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) // only movies mode uses api pages
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  // if user searched from navbar, update box value
  useEffect(() => {
    setSearch(q)
    setPage(1)
  }, [q])

  // default lists: popular movies + series + actors
  useEffect(() => {
    getGenres()
      .then((genres) => popularMovies(1).then((data) => ({ genres, data })))
      .then(({ genres, data }) => {
        setMovies(data.results.map((m) => toCard(m, genres)))
        setTotalPages(Math.min(data.total_pages, 500)) // tmdb caps at 500
        setLoading(false)
      })
      .catch(() => {
        setError('Something went wrong. Please try again later.')
        setLoading(false)
      })

    fetch('https://api.tvmaze.com/shows')
      .then((res) => res.json())
      .then((data) => {
        // only real series here, no reality/talk stuff
        setSeries(data.filter((s) => s.type === 'Scripted' || s.type === 'Animation'))
      })
      .catch(() => {})

    // default actors so the tab is not empty
    fetch('https://api.tvmaze.com/people')
      .then((res) => res.json())
      .then((data) => setPeople(data))
      .catch(() => {})
  }, [])

  // load one page of tmdb movies (popular or search)
  const loadMovies = (text, pageNum) => {
    setLoading(true)
    setError('')
    const run = text.trim() === '' ? popularMovies(pageNum) : searchMovies(text, pageNum)
    getGenres()
      .then((genres) => run.then((data) => ({ genres, data })))
      .then(({ genres, data }) => {
        setMovies(data.results.map((m) => toCard(m, genres)))
        setTotalPages(Math.min(data.total_pages, 500)) // tmdb stops after 500
        setLoading(false)
      })
      .catch(() => {
        setError('Search failed. Check your internet.')
        setLoading(false)
      })
  }

  // search while typing, waits a bit so we don't spam the api
  useEffect(() => {
    if (search.trim() === '') return

    const timer = setTimeout(() => {
      if (mode === 'movies') {
        loadMovies(search, page)
      } else if (mode === 'people') {
        setLoading(true)
        setError('')
        fetch(`https://api.tvmaze.com/search/people?q=${search}`)
          .then((res) => res.json())
          .then((data) => {
            setPeople(data.map((item) => item.person))
            setLoading(false)
          })
          .catch(() => {
            setError('Search failed. Check your internet.')
            setLoading(false)
          })
      } else {
        setLoading(true)
        setError('')
        fetch(`https://api.tvmaze.com/search/shows?q=${search}`)
          .then((res) => res.json())
          .then((data) => {
            setSeries(data.map((item) => item.show))
            setLoading(false)
          })
          .catch(() => {
            setError('Search failed. Check your internet.')
            setLoading(false)
          })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search, mode])

  // search button (same as live search, for slow typers)
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    if (search.trim() === '') {
      setLoading(true)
      if (mode === 'movies') {
        loadMovies('', 1)
      } else if (mode === 'people') {
        fetch('https://api.tvmaze.com/people')
          .then((res) => res.json())
          .then((data) => {
            setPeople(data)
            setLoading(false)
          })
      } else {
        fetch('https://api.tvmaze.com/shows')
          .then((res) => res.json())
          .then((data) => {
            setSeries(data.filter((s) => s.type === 'Scripted' || s.type === 'Animation'))
            setLoading(false)
          })
      }
      return
    }

    // search button does the same thing
    if (mode === 'movies') {      loadMovies(search, 1)
    } else if (mode === 'people') {
      setLoading(true)
      setError('')
      fetch(`https://api.tvmaze.com/search/people?q=${search}`)
        .then((res) => res.json())
        .then((data) => {
          setPeople(data.map((item) => item.person))
          setLoading(false)
        })
        .catch(() => {
          setError('Search failed. Check your internet.')
          setLoading(false)
        })
    } else {
      setLoading(true)
      setError('')
      fetch(`https://api.tvmaze.com/search/shows?q=${search}`)
        .then((res) => res.json())
        .then((data) => {
          setSeries(data.map((item) => item.show))
          setLoading(false)
        })
        .catch(() => {
          setError('Search failed. Check your internet.')
          setLoading(false)
        })
    }
  }

  // typing or switching tabs always starts from page 1
  const onType = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }
  const switchMode = (m) => {
    const sameTab = m === mode
    const emptyBox = search.trim() === ''
    setMode(m)
    setPage(1)
    window.scrollTo(0, 0)
    // auto search won't run here (same tab = nothing changed,
    // empty box = skipped), so load movies first page directly
    if (m === 'movies' && (sameTab || emptyBox)) loadMovies(search, 1)
  }
  const goPage = (p) => {
    setPage(p)
    window.scrollTo(0, 0)
    // movies come page by page from the api, so fetch the new page
    if (mode === 'movies') loadMovies(search, p)
  }

  // paging math - movies come paged from tmdb, the rest slice locally
  const localList = mode === 'series' ? series : people
  const pages = mode === 'movies' ? totalPages : Math.max(1, Math.ceil(localList.length / PER_PAGE))
  const safePage = Math.min(page, pages)
  const shownSeries = series.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const shownPeople = people.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const list = mode === 'movies' ? movies : mode === 'people' ? shownPeople : shownSeries
  const noResult = !loading && !error && list.length === 0

  const hints = {
    movies: '🔍 Search for a movie...',
    series: '🔍 Search for a series...',
    people: '🔍 Search for an actor...',
  }

  return (
    <div className="movies-page">
      <h1 className="page-title">Browse Movies</h1>
      <p className="page-sub">Movies from TMDB, series and actors from TVMaze.</p>

      {/* movies / series / actors toggle */}
      <div className="mode-row">
        <button
          className={mode === 'movies' ? 'mode-btn on' : 'mode-btn'}
          onClick={() => switchMode('movies')}
        >
          🎬 Movies
        </button>
        <button
          className={mode === 'series' ? 'mode-btn on' : 'mode-btn'}
          onClick={() => switchMode('series')}
        >
          📺 Series
        </button>
        <button
          className={mode === 'people' ? 'mode-btn on' : 'mode-btn'}
          onClick={() => switchMode('people')}
        >
          🧑 Actors
        </button>
      </div>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder={hints[mode]}
          aria-label="Search movies"
          value={search}
          onChange={onType}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}
      {noResult && search.trim() !== '' && (
        <p className="status">No results found. Try another name.</p>
      )}

      {mode === 'people' ? (
        <div className="movie-grid">
          {shownPeople.map((p) => (
            <div className="card" key={p.id}>
              <img
                src={p.image?.medium || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='210' height='295'><rect width='100%' height='100%' fill='%23334155'/><text x='50%' y='50%' fill='%2394a3b8' font-size='16' text-anchor='middle'>No Photo</text></svg>"}
                alt={p.name}
                className="card-img"
                loading="lazy"
              />
              <div className="card-body">
                <h3 className="card-title">{p.name}</h3>
                <p className="card-meta">
                  <span>🌍 {p.country?.name || 'N/A'}</span>
                  <span>•</span>
                  <span>🎂 {p.birthday || 'N/A'}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="movie-grid">
          {(mode === 'movies' ? movies : shownSeries).map((m) => (
            <MovieCard key={m.id} movie={m} onDetails={setSelected} />
          ))}
        </div>
      )}

      {/* prev / next */}
      {!loading && !error && pages > 1 && (
        <div className="pager">
          <button disabled={loading || safePage <= 1} onClick={() => goPage(safePage - 1)}>
            ← Prev
          </button>
          <span>Page {safePage} of {pages}</span>
          <button disabled={loading || safePage >= pages} onClick={() => goPage(safePage + 1)}>
            Next →
          </button>
        </div>
      )}

      {/* details popup */}
      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default Movies
