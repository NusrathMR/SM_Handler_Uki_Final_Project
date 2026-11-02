import { useEffect, useState } from "react"
import { getAdminSettings, saveAdminSettings } from "../../api/api.js"
import "./adminPage.css"

const initialSettings = {
  platformName: "Socialynk",
  supportEmail: "support@socialynk.io",
  allowNewSignUps: true,
  requireEmailVerification: true,
  defaultPlan: "starter",
  enableAiAssistant: true,
  dailyAiRequests: 40,
  maxImageUploadSize: 10,
  allowedImageTypes: {
    jpg: true,
    png: true,
    webp: true,
  },
  maintenanceMode: false,
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={checked ? "ad-toggle on" : "ad-toggle"}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="ad-toggle-knob" />
    </button>
  )
}

function validateSettings(settings) {
  const nextErrors = {}

  if (!settings.platformName.trim()) {
    nextErrors.platformName = "Platform name is required."
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(settings.supportEmail.trim())) {
    nextErrors.supportEmail = "Support email must be a valid email."
  }

  if (!Number.isFinite(Number(settings.dailyAiRequests)) || Number(settings.dailyAiRequests) <= 0) {
    nextErrors.dailyAiRequests = "Daily AI requests must be greater than 0."
  }

  if (!Number.isFinite(Number(settings.maxImageUploadSize)) || Number(settings.maxImageUploadSize) <= 0) {
    nextErrors.maxImageUploadSize = "Image upload size must be greater than 0."
  } else if (Number(settings.maxImageUploadSize) > 25) {
    nextErrors.maxImageUploadSize = "Image upload size cannot be more than 25 MB."
  }

  if (!settings.allowedImageTypes.jpg && !settings.allowedImageTypes.png && !settings.allowedImageTypes.webp) {
    nextErrors.allowedImageTypes = "Select at least one image type."
  }

  return nextErrors
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings)
  const [savedSettings, setSavedSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [saveNotice, setSaveNotice] = useState("")
  const [errorNotice, setErrorNotice] = useState("")

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getAdminSettings()
        setSettings(data)
        setSavedSettings(data)
      } catch (error) {
        setErrorNotice(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleChange = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }))
  }

  const handleCheckbox = (field, value) => {
    setSettings((current) => ({
      ...current,
      allowedImageTypes: {
        ...current.allowedImageTypes,
        [field]: value,
      },
    }))
  }

  const handleReset = () => {
    setSettings(savedSettings)
    setErrors({})
    setSaveNotice("")
    setErrorNotice("")
  }

  const handleSave = async () => {
    const nextErrors = validateSettings(settings)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setErrorNotice("Please fix the highlighted fields.")
      setSaveNotice("")
      return
    }

    setErrorNotice("")
    setSaveNotice("")
    setSaving(true)

    const body = {
      platformName: settings.platformName,
      supportEmail: settings.supportEmail,
      allowNewSignUps: settings.allowNewSignUps,
      requireEmailVerification: settings.requireEmailVerification,
      defaultPlan: settings.defaultPlan,
      enableAiAssistant: settings.enableAiAssistant,
      dailyAiRequests: Number(settings.dailyAiRequests),
      maxImageUploadSize: Number(settings.maxImageUploadSize),
      allowedImageTypes: {
        jpg: settings.allowedImageTypes.jpg,
        png: settings.allowedImageTypes.png,
        webp: settings.allowedImageTypes.webp,
      },
      maintenanceMode: settings.maintenanceMode,
    }

    try {
      const data = await saveAdminSettings(body)
      setSettings(data)
      setSavedSettings(data)
      setErrors({})
      setSaveNotice("Settings saved successfully")
    } catch (error) {
      setErrorNotice(error.message)
      if (error.fieldErrors) {
        setErrors(error.fieldErrors)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="ad-page">Loading settings...</div>
  }

  return (
    <div className="ad-page ad-settings-page">
      {errorNotice && <div className="ad-message-error">{errorNotice}</div>}
      {saveNotice && <div className="ad-message-success">{saveNotice}</div>}

      <div className="ad-settings-grid">
        <div className="ad-panel">
          <div className="ad-panel-header">
            <div>
              <h3>General</h3>
              <p>Basic platform details.</p>
            </div>
          </div>

          <div className="ad-field-group">
            <label htmlFor="platformName">Platform name</label>
            <input
              id="platformName"
              type="text"
              value={settings.platformName}
              onChange={(event) => handleChange("platformName", event.target.value)}
            />
            {errors.platformName && <span className="ad-field-error">{errors.platformName}</span>}
          </div>

          <div className="ad-field-group">
            <label htmlFor="supportEmail">Support email</label>
            <input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(event) => handleChange("supportEmail", event.target.value)}
            />
            {errors.supportEmail && <span className="ad-field-error">{errors.supportEmail}</span>}
          </div>
        </div>

        <div className="ad-panel">
          <div className="ad-panel-header">
            <div>
              <h3>Registration</h3>
              <p>New-user onboarding rules.</p>
            </div>
          </div>

          <div className="ad-toggle-row">
            <div>
              <strong>Allow new sign-ups</strong>
            </div>
            <Toggle
              checked={settings.allowNewSignUps}
              onChange={(value) => handleChange("allowNewSignUps", value)}
            />
          </div>

          <div className="ad-toggle-row">
            <div>
              <strong>Require email verification</strong>
            </div>
            <Toggle
              checked={settings.requireEmailVerification}
              onChange={(value) => handleChange("requireEmailVerification", value)}
            />
          </div>

          <div className="ad-field-group">
            <label htmlFor="defaultPlan">Default plan for new users</label>
            <select
              id="defaultPlan"
              value={settings.defaultPlan}
              onChange={(event) => handleChange("defaultPlan", event.target.value)}
            >
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        <div className="ad-panel">
          <div className="ad-panel-header">
            <div>
              <h3>AI Assistant</h3>
              <p>Usage and enablement settings.</p>
            </div>
          </div>

          <div className="ad-toggle-row">
            <div>
              <strong>Enable AI assistant</strong>
            </div>
            <Toggle
              checked={settings.enableAiAssistant}
              onChange={(value) => handleChange("enableAiAssistant", value)}
            />
          </div>

          <div className="ad-field-group">
            <label htmlFor="dailyAiRequests">Daily AI requests per user</label>
            <input
              id="dailyAiRequests"
              type="number"
              min="1"
              value={settings.dailyAiRequests}
              onChange={(event) => handleChange("dailyAiRequests", event.target.value)}
            />
            {errors.dailyAiRequests && <span className="ad-field-error">{errors.dailyAiRequests}</span>}
          </div>
        </div>

        <div className="ad-panel">
          <div className="ad-panel-header">
            <div>
              <h3>Media</h3>
              <p>Upload quality and file restrictions.</p>
            </div>
          </div>

          <div className="ad-field-group">
            <label htmlFor="maxImageUploadSize">Max image upload size in MB</label>
            <input
              id="maxImageUploadSize"
              type="number"
              min="1"
              value={settings.maxImageUploadSize}
              onChange={(event) => handleChange("maxImageUploadSize", event.target.value)}
            />
            {errors.maxImageUploadSize && <span className="ad-field-error">{errors.maxImageUploadSize}</span>}
          </div>

          <div className="ad-checkbox-list">
            {Object.entries(settings.allowedImageTypes).map(([type, checked]) => (
              <label key={type} className="ad-checkbox-row">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => handleCheckbox(type, event.target.checked)}
                />
                <span>{type.toUpperCase()}</span>
              </label>
            ))}
          </div>
          {errors.allowedImageTypes && <span className="ad-field-error">{errors.allowedImageTypes}</span>}
        </div>

        <div className="ad-panel ad-maintenance-panel">
          <div className="ad-panel-header">
            <div>
              <h3>Maintenance</h3>
              <p>Temporary site availability controls.</p>
            </div>
          </div>

          <div className="ad-toggle-row">
            <div>
              <strong>Maintenance mode</strong>
            </div>
            <Toggle
              checked={settings.maintenanceMode}
              onChange={(value) => handleChange("maintenanceMode", value)}
            />
          </div>

          {settings.maintenanceMode && (
            <div className="ad-warning-banner">
              Users will see a maintenance message while this is on.
            </div>
          )}
        </div>
      </div>

      <div className="ad-settings-actions">
        <button type="button" className="ad-btn ad-btn-dark" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>   
        <button type="button" className="ad-btn ad-btn-light" onClick={handleReset} disabled={saving}>
          Reset
        </button>
      </div>
    </div>
  )
}
