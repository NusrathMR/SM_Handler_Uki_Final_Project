import "./adminPage.css"

export default function AdminComingSoon({ title = "Coming Soon" }) {
  return (
    <div className="ad-empty-state ad-coming-soon">
      <h3>{title}</h3>
      <p>This admin section is coming soon.</p>
    </div>
  )
}
