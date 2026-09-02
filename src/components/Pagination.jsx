const Pagination = ({ page, totalPages, onPageChange, disabled = false }) => {
  if (totalPages <= 1) return null
  const visiblePages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b)
  return (
    <nav className="page-pagination" aria-label="Results pages">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        ‹ <span>Previous</span>
      </button>
      <div className="page-numbers">
        {visiblePages.map((number, index) => (
          <span className="page-number-group" key={number}>
            {index > 0 && number - visiblePages[index - 1] > 1 && (
              <span className="page-gap" aria-hidden="true">
                …
              </span>
            )}
            <button
              type="button"
              aria-label={`Page ${number}`}
              aria-current={page === number ? 'page' : undefined}
              disabled={disabled}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </span>
        ))}
      </div>
      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <span>Next</span> ›
      </button>
    </nav>
  )
}
export default Pagination
