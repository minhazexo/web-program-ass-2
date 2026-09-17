function MovieModal({ movie, onClose }) {
  if (!movie) return null

  const img = movie.image?.original || movie.image?.medium || ''
  const rating = movie.rating?.average || 'N/A'
  const year = movie.premiered || 'Unknown'
  const genres = movie.genres && movie.genres.length > 0 ? movie.genres.join(', ') : 'N/A'

  // remove html tags from summary
  const cleanSummary = movie.summary
    ? movie.summary.replace(/<[^>]+>/g, '')
    : 'No summary available.'

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>✕</button>

        {img ? (
          <img src={img} alt={movie.name} className="modal-img" />
        ) : (
          <div className="modal-backup">No Image</div>
        )}

        <div className="modal-body">
          <h2>{movie.name}</h2>
          <p className="modal-info">
            ⭐ Rating: {rating} &nbsp; | &nbsp; 📅 Release: {year}
          </p>
          <p className="modal-info small">
            🎭 Genre: {genres} &nbsp; • &nbsp; 🌍 {movie.language || 'N/A'} &nbsp; • &nbsp; ⏱ {movie.runtime || '?'} min
          </p>

          <h4>Overview:</h4>
          <p className="modal-summary">{cleanSummary}</p>

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
