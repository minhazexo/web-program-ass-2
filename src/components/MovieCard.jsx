// one movie card
function MovieCard({ movie, onDetails }) {
  const img = movie.image?.medium || movie.image?.original || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='210' height='295'><rect width='100%' height='100%' fill='%23334155'/><text x='50%' y='50%' fill='%2394a3b8' font-size='16' text-anchor='middle'>No Image</text></svg>"
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
