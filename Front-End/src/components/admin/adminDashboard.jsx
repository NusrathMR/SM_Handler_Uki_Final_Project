import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../api/api.js"
import "./adminPage.css"

const planOrder = ["free", "starter", "pro", "business"]
const statusOrder = ["draft", "scheduled", "publishing", "published", "failed"]
const platformOrder = ["instagram", "facebook", "linkedin", "x", "tiktok"]

function formatNumber(value) {
  return value.toLocaleString()
}

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString()
}

function formatDateTime(value) {
  if (!value) return "—"
  return new Date(value).toLocaleString()
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days} day${days === 1 ? "" : "s"}, ${hours} hour${hours === 1 ? "" : "s"}, ${minutes} minute${minutes === 1 ? "" : "s"}`
}

function getErrorMessage(error) {
  const message = error?.response?.data?.message
  return typeof message === "string" && message.trim()
    ? message
    : "Could not load the dashboard. Please try again."
}

function ActivityChart({ title, series }) {
  const total = series.reduce((sum, item) => sum + item.count, 0)
  const maximum = Math.max(...series.map((item) => item.count), 0)
  const labelEvery = Math.max(1, Math.ceil(series.length / 7))

  return (
    <section className="ad-dash-panel">
      <h2 className="ad-dash-section-title">{title}</h2>
      {total === 0 ? (
        <p className="ad-dash-empty">No activity in this period.</p>
      ) : (
        <div
          className="ad-dash-chart-scroll"
          role="img"
          aria-label={`${title}: ${formatNumber(total)} total`}
        >
          <div className="ad-dash-chart">
            {series.map((item, index) => {
              const labelDate = item.date.split("-").slice(1).map(Number)
              const showLabel = index % labelEvery === 0 || index === series.length - 1
              const height = maximum === 0 ? 0 : (item.count / maximum) * 100

              return (
                <div className="ad-dash-chart-day" key={item.date}>
                  <div className="ad-dash-chart-bar-space">
                    <span
                      className="ad-dash-chart-bar"
                      style={{ height: `${height}%` }}
                      title={`${item.date}: ${formatNumber(item.count)}`}
                    />
                  </div>
                  <span className="ad-dash-chart-label">
                    {showLabel ? `${labelDate[0]}/${labelDate[1]}` : ""}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function Breakdown({ title, values, order, total }) {
  if (total === 0) {
    return (
      <section className="ad-dash-panel">
        <h2 className="ad-dash-section-title">{title}</h2>
        <p className="ad-dash-empty">No data yet.</p>
      </section>
    )
  }

  return (
    <section className="ad-dash-panel">
      <h2 className="ad-dash-section-title">{title}</h2>
      <div className="ad-dash-breakdown">
        {order.map((key) => {
          const count = values[key] || 0
          const percentage = (count / total) * 100

          return (
            <div className="ad-dash-breakdown-row" key={key}>
              <div className="ad-dash-breakdown-label">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <strong>
                  {formatNumber(count)} <span>{Math.round(percentage)}%</span>
                </strong>
              </div>
              <div className="ad-dash-breakdown-track">
                <span style={{ width: `${Math.min(percentage, 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function HealthRow({ label, value, detail, healthy }) {
  return (
    <div className="ad-dash-health-row">
      <span className={healthy === undefined ? "ad-dash-health-dot neutral" : `ad-dash-health-dot ${healthy ? "good" : "bad"}`} />
      <span className="ad-dash-health-label">{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(true)
  const [error, setError] = useState("")
  const [days, setDays] = useState(14)
  const requestId = useRef(0)
  const mounted = useRef(false)

  const loadDashboard = useCallback(async () => {
    const currentRequestId = ++requestId.current
    setRefreshing(true)
    setError("")

    try {
      const response = await api.get("/admin/dashboard", { params: { days } })
      if (!mounted.current || currentRequestId !== requestId.current) return
      setData(response.data)
    } catch (requestError) {
      if (!mounted.current || currentRequestId !== requestId.current) return
      setError(getErrorMessage(requestError))
    } finally {
      if (mounted.current && currentRequestId === requestId.current) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [days])

  useEffect(() => {
    mounted.current = true
    const initialRequest = setTimeout(() => {
      void loadDashboard()
    }, 0)
    const interval = setInterval(() => {
      void loadDashboard()
    }, 60000)

    return () => {
      mounted.current = false
      requestId.current += 1
      clearTimeout(initialRequest)
      clearInterval(interval)
    }
  }, [loadDashboard])

  if (loading && !data) {
    return <div className="ad-dash-loading" role="status">Loading dashboard...</div>
  }

  const users = data?.users
  const posts = data?.posts
  const health = data?.health
  const hasSchedulerIssues =
    health && (health.overdueScheduled > 0 || health.stuckPublishing > 0)

  return (
    <div className="ad-page ad-dash-page">
      <header className="ad-dash-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Last updated: {data ? formatDateTime(data.generatedAt) : "—"}
            {refreshing && <span className="ad-dash-updating"> · Updating...</span>}
          </p>
        </div>
        <div className="ad-dash-header-actions">
          <label className="ad-dash-period">
            <span>Period</span>
            <select value={days} onChange={(event) => setDays(Number(event.target.value))}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </label>
          <button
            type="button"
            className="ad-btn ad-btn-light"
            onClick={() => void loadDashboard()}
            disabled={refreshing}
          >
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="ad-dash-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="ad-btn ad-btn-light"
            onClick={() => void loadDashboard()}
            disabled={refreshing}
          >
            Try again
          </button>
        </div>
      )}

      {data && (
        <>
          <section className="ad-dash-stats">
            <article className="ad-dash-stat">
              <span>Total users</span>
              <strong>{formatNumber(users.total)}</strong>
              <small>{formatNumber(users.inactive)} inactive</small>
            </article>
            <article className="ad-dash-stat">
              <span>Active users</span>
              <strong>{formatNumber(users.active)}</strong>
            </article>
            <article className="ad-dash-stat">
              <span>New users</span>
              <strong>{formatNumber(users.newInPeriod)}</strong>
              <small>Last {data.days} days</small>
            </article>
            <article className="ad-dash-stat">
              <span>Total posts</span>
              <strong>{formatNumber(posts.total)}</strong>
              <small>{formatNumber(posts.createdInPeriod)} created in the last {data.days} days</small>
            </article>
            <article className="ad-dash-stat">
              <span>Published posts</span>
              <strong>{formatNumber(posts.publishedInPeriod)}</strong>
              <small>Last {data.days} days</small>
            </article>
            <article className={`ad-dash-stat${posts.byStatus.failed > 0 ? " attention" : ""}`}>
              <span>Failed posts</span>
              <strong>{formatNumber(posts.byStatus.failed)}</strong>
            </article>
          </section>

          <section className="ad-dash-two-column">
            <ActivityChart title="New users per day" series={data.activity.newUsersPerDay} />
            <ActivityChart title="Posts created per day" series={data.activity.postsPerDay} />
          </section>

          <section className="ad-dash-three-column">
            <Breakdown
              title="Users by plan"
              values={users.byPlan}
              order={planOrder}
              total={users.total}
            />
            <Breakdown
              title="Posts by status"
              values={posts.byStatus}
              order={statusOrder}
              total={posts.total}
            />
            <Breakdown
              title="Posts by platform"
              values={posts.byPlatform}
              order={platformOrder}
              total={posts.total}
            />
          </section>

          <section className="ad-dash-three-column">
            <section className="ad-dash-panel">
              <h2 className="ad-dash-section-title">Recent signups</h2>
              {data.recentUsers.length === 0 ? (
                <p className="ad-dash-empty">No users yet.</p>
              ) : (
                <div className="ad-dash-list">
                  {data.recentUsers.map((person) => (
                    <div className="ad-dash-list-row" key={person.id}>
                      <div className="ad-dash-list-main">
                        <strong>{person.name}</strong>
                        <span>{person.email}</span>
                      </div>
                      <span className="ad-badge ad-badge-plan">{person.plan}</span>
                      <span className="ad-dash-list-date">{formatDate(person.createdAt)}</span>
                      {!person.isActive && <span className="ad-dash-inactive-tag">Inactive</span>}
                    </div>
                  ))}
                </div>
              )}
              <Link to="/admin/users" className="ad-link-inline">View all users</Link>
            </section>

            <section className="ad-dash-panel">
              <h2 className="ad-dash-section-title">Most active users</h2>
              {data.topUsers.length === 0 ? (
                <p className="ad-dash-empty">No posts have been created yet.</p>
              ) : (
                <div className="ad-dash-list">
                  {data.topUsers.map((person) => (
                    <div className="ad-dash-list-row" key={person.id}>
                      <div className="ad-dash-list-main">
                        <strong>{person.name}</strong>
                        <span>{person.email}</span>
                      </div>
                      <span className="ad-dash-list-count">
                        {formatNumber(person.postCount)} posts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="ad-dash-panel">
              <h2 className="ad-dash-section-title">Needs attention</h2>
              {data.failedPosts.length === 0 ? (
                <p className="ad-dash-empty">No failed posts. Everything looks healthy.</p>
              ) : (
                <div className="ad-dash-list">
                  {data.failedPosts.map((post) => (
                    <article className="ad-dash-failed-post" key={post.id}>
                      <strong>{post.ownerEmail || "Owner unavailable"}</strong>
                      <span>{post.platforms.join(", ")}</span>
                      <p>{post.publishError || "No error message provided."}</p>
                      <small>
                        Tries: {formatNumber(post.publishAttempts)} · Last updated: {formatDateTime(post.updatedAt)}
                      </small>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>

          <section className="ad-dash-panel">
            <h2 className="ad-dash-section-title">System health</h2>
            <div className="ad-dash-health">
              <HealthRow
                label="Database"
                value={health.database}
                detail={health.database === "connected" ? "Connection available" : "Connection unavailable"}
                healthy={health.database === "connected"}
              />
              <HealthRow
                label="Server uptime"
                value={formatUptime(health.uptimeSeconds)}
                detail="Since server start"
              />
              <HealthRow
                label="Overdue scheduled posts"
                value={formatNumber(health.overdueScheduled)}
                detail={health.overdueScheduled === 0 ? "No overdue posts" : "Overdue posts detected"}
                healthy={health.overdueScheduled === 0}
              />
              <HealthRow
                label="Stuck publishing posts"
                value={formatNumber(health.stuckPublishing)}
                detail={health.stuckPublishing === 0 ? "No stuck posts" : "Stuck posts detected"}
                healthy={health.stuckPublishing === 0}
              />
            </div>
            {hasSchedulerIssues && (
              <p className="ad-dash-health-hint">The scheduler may not be running.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
