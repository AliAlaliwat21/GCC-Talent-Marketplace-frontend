export const ListingSkeletons = ({ count = 9 }) => (
  <div role="status" aria-label="Loading results">
    <span className="sr-only">Loading results…</span>
    <div className="marketplace-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="marketplace-card skeleton-card" key={index}>
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton skeleton-short" />
          <div className="skeleton skeleton-action" />
        </div>
      ))}
    </div>
  </div>
)
export const EmptyState = ({ title, description, action, onAction }) => (
  <div className="listing-empty" role="status">
    <span className="empty-symbol" aria-hidden="true">
      ⌕
    </span>
    <h2>{title}</h2>
    <p>{description}</p>
    {action && (
      <button className="outline-button" type="button" onClick={onAction}>
        {action}
      </button>
    )}
  </div>
)
