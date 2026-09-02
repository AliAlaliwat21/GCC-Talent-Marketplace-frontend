import { useEffect, useState } from 'react'
import { changePassword, showMe, updateMe } from '../services/user'
import { EmptyState } from '../components/ListingStates'

const AccountSettings = ({ user, setUser }) => {
  const [accountData, setAccountData] = useState({
    username: '',
    avatarUrl: '',
    country: '',
    city: '',
    emailNotifications: true,
    inAppNotifications: true,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [accountNotice, setAccountNotice] = useState(null)
  const [passwordNotice, setPasswordNotice] = useState(null)
  const [savingAccount, setSavingAccount] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  useEffect(() => {
    let active = true
    showMe()
      .then((data) => {
        if (!active) return
        setAccountData({
          username: data.username || '',
          avatarUrl: data.avatarUrl || '',
          country: data.country || '',
          city: data.city || '',
          emailNotifications: data.notificationPrefs?.email !== false,
          inAppNotifications: data.notificationPrefs?.inApp !== false,
        })
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [attempt])
  const handleAccountChange = (event) =>
    setAccountData({
      ...accountData,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value,
    })
  const handleAccountSubmit = async (event) => {
    event.preventDefault()
    setAccountNotice(null)
    setSavingAccount(true)
    try {
      const payload = {
        username: accountData.username,
        avatarUrl: accountData.avatarUrl,
        city: accountData.city,
        notificationPrefs: {
          email: accountData.emailNotifications,
          inApp: accountData.inAppNotifications,
        },
      }
      if (accountData.country) payload.country = accountData.country
      const data = await updateMe(payload)
      setUser({ ...user, username: data.username })
      setAccountNotice({
        kind: 'success',
        text: 'Your account and notification preferences have been saved.',
      })
    } catch (error) {
      setAccountNotice({ kind: 'error', text: error.message })
    } finally {
      setSavingAccount(false)
    }
  }
  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setPasswordNotice(null)
    setSavingPassword(true)
    try {
      const data = await changePassword(passwordData)
      setPasswordData({ currentPassword: '', newPassword: '' })
      setPasswordNotice({
        kind: 'success',
        text: data.message || 'Your password has been changed.',
      })
    } catch (error) {
      setPasswordNotice({ kind: 'error', text: error.message })
    } finally {
      setSavingPassword(false)
    }
  }
  const changePasswordField = (event) =>
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value,
    })
  return (
    <section className="settings-page">
      <header>
        <p className="eyebrow">MAKE YOURSELF AT HOME</p>
        <h1>Account settings</h1>
        <p>Manage your details, security and notification preferences.</p>
      </header>
      {loading ? (
        <div className="settings-grid" role="status">
          <span className="sr-only">Loading account settings…</span>
          {[1, 2].map((key) => (
            <div
              className="settings-panel skeleton-card"
              key={key}
              aria-hidden="true"
            >
              <div className="skeleton skeleton-title" />
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <EmptyState
          title="Your settings couldn’t be loaded"
          description="Please try again before making changes."
          action="Try again"
          onAction={() => {
            setLoadError(false)
            setLoading(true)
            setAttempt((value) => value + 1)
          }}
        />
      ) : (
        <div className="settings-grid">
          <form
            className="settings-panel account-panel"
            id="account-form"
            onSubmit={handleAccountSubmit}
          >
            <div className="panel-heading">
              <span className="panel-number" aria-hidden="true">
                01
              </span>
              <div>
                <h2>Profile & account</h2>
                <p>Your public details on GCC Talent.</p>
              </div>
            </div>
            <fieldset disabled={savingAccount} className="settings-fields">
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  value={accountData.username}
                  onChange={handleAccountChange}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="avatarUrl">Avatar URL</label>
                <input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  value={accountData.avatarUrl}
                  onChange={handleAccountChange}
                  placeholder="https://…"
                />
              </div>
              <div className="settings-field-row">
                <div className="form-field">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={accountData.country}
                    onChange={handleAccountChange}
                  >
                    <option value="">Select country</option>
                    {[
                      'Bahrain',
                      'Kuwait',
                      'Oman',
                      'Qatar',
                      'Saudi Arabia',
                      'United Arab Emirates',
                    ].map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    value={accountData.city}
                    onChange={handleAccountChange}
                    autoComplete="address-level2"
                  />
                </div>
              </div>
            </fieldset>
            {accountNotice && (
              <p
                className={`form-notice ${accountNotice.kind}`}
                role={accountNotice.kind === 'error' ? 'alert' : 'status'}
              >
                {accountNotice.text}
              </p>
            )}
            <div className="settings-save">
              <p>Also saves your notification preferences.</p>
              <button type="submit" disabled={savingAccount}>
                {savingAccount ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
          <div className="settings-side">
            <form className="settings-panel" onSubmit={handlePasswordSubmit}>
              <div className="panel-heading">
                <span className="panel-number" aria-hidden="true">
                  02
                </span>
                <div>
                  <h2>Security</h2>
                  <p>Keep your account protected.</p>
                </div>
              </div>
              <fieldset disabled={savingPassword} className="settings-fields">
                <div className="form-field">
                  <label htmlFor="currentPassword">Current password</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={changePasswordField}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    minLength="8"
                    value={passwordData.newPassword}
                    onChange={changePasswordField}
                    autoComplete="new-password"
                    aria-describedby="password-hint"
                    required
                  />
                  <span className="field-hint" id="password-hint">
                    Use at least 8 characters.
                  </span>
                </div>
              </fieldset>
              {passwordNotice && (
                <p
                  className={`form-notice ${passwordNotice.kind}`}
                  role={passwordNotice.kind === 'error' ? 'alert' : 'status'}
                >
                  {passwordNotice.text}
                </p>
              )}
              <button
                className="outline-button"
                type="submit"
                disabled={savingPassword}
              >
                {savingPassword ? 'Updating…' : 'Change password'}
              </button>
            </form>
            <section
              className="settings-panel notification-panel"
              aria-labelledby="notification-heading"
            >
              <div className="panel-heading">
                <span className="panel-number" aria-hidden="true">
                  03
                </span>
                <div>
                  <h2 id="notification-heading">Notifications</h2>
                  <p>Choose how you stay up to date.</p>
                </div>
              </div>
              <label className="switch-row">
                <span>Email notifications</span>
                <input
                  form="account-form"
                  role="switch"
                  name="emailNotifications"
                  type="checkbox"
                  checked={accountData.emailNotifications}
                  onChange={handleAccountChange}
                  disabled={savingAccount}
                />
              </label>
              <label className="switch-row">
                <span>In-app notifications</span>
                <input
                  form="account-form"
                  role="switch"
                  name="inAppNotifications"
                  type="checkbox"
                  checked={accountData.inAppNotifications}
                  onChange={handleAccountChange}
                  disabled={savingAccount}
                />
              </label>
              <p className="field-hint">
                Use Save changes to apply these preferences.
              </p>
            </section>
          </div>
        </div>
      )}
    </section>
  )
}
export default AccountSettings
