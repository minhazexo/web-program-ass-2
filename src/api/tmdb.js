// small helper for TMDB (real movies)
const TOKEN = import.meta.env.VITE_TMDB_TOKEN

function tmdb(path) {
  return fetch(`https://api.themoviedb.org/3${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  }).then((res) => {
    if (!res.ok) throw new Error('tmdb failed')
    return res.json()
  })
}

export function img(size, path) {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}

// genre id -> name map, loaded once
let genreMap = null
export async function getGenres() {
  if (genreMap) return genreMap
  const data = await tmdb('/genre/movie/list?language=en')
  genreMap = {}
  data.genres.forEach((g) => (genreMap[g.id] = g.name))
  return genreMap
}

// shape a TMDB movie like our card object so cards + modal just work
export function toCard(m, genres) {
  return {
    id: 'tmdb-' + m.id,
    tmdbId: m.id,
    source: 'tmdb',
    name: m.title,
    image: {
      medium: img('w500', m.poster_path),
      original: img('original', m.poster_path),
    },
    backdrop: img('original', m.backdrop_path),
    rating: { average: m.vote_average ? +m.vote_average.toFixed(1) : null },
    premiered: m.release_date || '',
    summary: m.overview ? '<p>' + m.overview + '</p>' : '',
    genres: (m.genre_ids || []).map((g) => genres[g]).filter(Boolean),
    language: (m.original_language || '').toUpperCase(),
    status: 'Released',
  }
}

export function popularMovies(page = 1) {
  return tmdb(`/movie/popular?language=en-US&page=${page}`)
}

export function searchMovies(query, page = 1) {
  return tmdb(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`)
}

export function movieDetails(id) {
  return tmdb(`/movie/${id}?language=en-US`)
}

export function movieCredits(id) {
  return tmdb(`/movie/${id}/credits?language=en-US`)
}
