import { Children, useRef, useState } from 'react'
import Pagination from './Pagination'

const PagedList = ({
  children,
  label,
  pageSize = 6,
  className = '',
  disabled = false,
}) => {
  const items = Children.toArray(children)
  const [requestedPage, setPage] = useState(1)
  const container = useRef(null)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(requestedPage, totalPages)
  const start = (page - 1) * pageSize

  const changePage = (nextPage) => {
    setPage(nextPage)
    container.current?.focus({ preventScroll: true })
    container.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  return (
    <section
      className="paged-list"
      aria-label={label}
      tabIndex={-1}
      ref={container}
    >
      {totalPages > 1 && (
        <p className="paged-list-count" role="status">
          {start + 1}–{Math.min(start + pageSize, items.length)} of{' '}
          {items.length} {label.toLowerCase()}
        </p>
      )}
      <div className={className}>{items.slice(start, start + pageSize)}</div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={changePage}
        disabled={disabled}
      />
    </section>
  )
}

export default PagedList
