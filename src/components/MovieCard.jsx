// one movie card
function MovieCard({ movie, onDetails }) {
  const img = movie.image?.medium || movie.image?.original || 'https://via.placeholder.com/210x295?text=No+Image'
  const year = movie.premiered ? movie.premiered.slice(0, 4) : 'N/A'
  const rating = movie.rating?.average ? movie.rating.average : 'N/A'

  return (
    <div className="card">
      <img src={img} alt={movie.name} className="card-img" loading="lazy" />
      <div className="card-body">
        <h3 className="card-title">{movie.name}</h3>
        <p className="card-meta">
          <span>⭐ {rating}</span>
          <span>•</span>
          <span>📅 {year}</span>
        </p>
        <button className="card-btn" onClick={() => onDetails(movie)}>
          See Details
        </button>
      </div>
    </div>
  )
}

export default MovieCard
