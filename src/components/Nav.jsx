import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { signOut } from '../services/auth'

const Nav = ({ user, setUser }) => {
  const [openAt, setOpenAt] = useState(null)
  const [signingOut, setSigningOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdown = useRef(null)
  const trigger = useRef(null)
  const open = openAt === location.key
  useEffect(() => {
    if (!open) return
    const closeOutside = (event) => {
      if (!dropdown.current?.contains(event.target)) setOpenAt(null)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenAt(null)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])
  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error(error.message)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setOpenAt(null)
      setSigningOut(false)
      navigate('/')
    }
  }
  const roleLinks =
    user?.role === 'admin'
      ? [
          ['/admin', 'Admin dashboard'],
          ['/admin/users', 'Users'],
          ['/admin/categories', 'Categories'],
          ['/admin/skills', 'Skills'],
        ]
      : [
          ['/', 'Dashboard'],
          ...(user?.role === 'client'
            ? [
                ['/client/profile', 'Client profile'],
                ['/client/jobs', 'My jobs'],
              ]
            : [
                ['/freelancer/profile', 'Freelancer profile'],
                ['/proposals/mine', 'My proposals'],
              ]),
          ['/contracts', 'Contracts'],
          ['/wallet', 'Wallet'],
        ]
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link className="nav-brand" to="/" aria-label="GCC Talent home">
        <span className="brand-monogram" aria-hidden="true">
          G
        </span>
        GCC <span className="brand-light">Talent</span>
      </Link>
      <div className="nav-links">
        <NavLink to="/jobs">Find work</NavLink>
        <NavLink to="/freelancers">Find talent</NavLink>
      </div>
      <div className="nav-actions">
        {!user && (
          <div className="guest-actions">
            <Link to="/sign-in">Sign in</Link>
            <Link className="nav-join" to="/sign-up">
              Join now <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
        <div
          ref={dropdown}
          className={`nav-dropdown ${!user ? 'guest-dropdown' : ''}`}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setOpenAt(null)
          }}
        >
          <button
            ref={trigger}
            className="nav-menu-trigger"
            type="button"
            aria-expanded={open}
            aria-controls={open ? 'account-navigation' : undefined}
            onClick={() => setOpenAt(open ? null : location.key)}
          >
            {user ? (
              <>
                <span className="nav-avatar" aria-hidden="true">
                  {user.username?.slice(0, 1).toUpperCase()}
                </span>
                <span className="nav-username">{user.username}</span>
              </>
            ) : (
              <span>Menu</span>
            )}
            <span aria-hidden="true">{open ? '▴' : '▾'}</span>
          </button>
          {open && (
            <div className="nav-menu" id="account-navigation">
              {user && (
                <div className="menu-identity">
                  <strong>{user.username}</strong>
                  <span>{user.role}</span>
                </div>
              )}
              <div className="mobile-nav-links">
                <Link to="/jobs" onClick={() => setOpenAt(null)}>
                  Find work
                </Link>
                <Link to="/freelancers" onClick={() => setOpenAt(null)}>
                  Find talent
                </Link>
              </div>
              {user ? (
                <>
                  {roleLinks.map(([to, label]) => (
                    <NavLink
                      key={to}
                      to={to}
                      end
                      onClick={() => setOpenAt(null)}
                    >
                      {label}
                    </NavLink>
                  ))}
                  <div className="menu-divider" />
                  <NavLink to="/settings" onClick={() => setOpenAt(null)}>
                    Settings
                  </NavLink>
                  <button
                    type="button"
                    className="sign-out-button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    {signingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" onClick={() => setOpenAt(null)}>
                    Sign in
                  </Link>
                  <Link to="/sign-up" onClick={() => setOpenAt(null)}>
                    Join now
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
export default Nav
