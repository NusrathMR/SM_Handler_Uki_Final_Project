import "./aiToolsPage.css"
import { useNavigate } from "react-router-dom"
import Sidebar from "../sideBar/sidebar.jsx"
import TopBar from "../topBar/topBar.jsx"

const tools = [
  {
    icon: "✦",
    title: "AI Assistant",
    description: "Explore caption writing and improvement. Its current demo responses are not connected to a real AI service.",
  },
  {
    icon: "#",
    title: "Suggest Hashtags",
    description: "The editor shortcut is visible, but hashtag suggestions are not generated yet.",
  },
  {
    icon: "✓",
    title: "Grammar Check",
    description: "The editor shows a grammar-check label, but no grammar checker is connected yet.",
  },
  {
    icon: "▣",
    title: "Enhance Image",
    description: "The image enhancement control is a placeholder and does not process images yet.",
  },
]

function AiToolsPage() {
  const navigate = useNavigate()

  return (
    <div className="db-layout">
      <Sidebar />
      <div className="cr-wrap ai-wrap">
        <TopBar
          title="AI Tools"
          subtitle="Discover how AI helps you create better posts."
        />
        <div className="ai-content">
          <section className="ai-intro">
            <h2>AI tools for your content</h2>
            <p>Explore the AI-related controls in Socialynk and see what is available today.</p>
          </section>

          <section className="ai-tool-grid" aria-label="AI tools">
            {tools.map((tool) => (
              <article className="ai-tool-card" key={tool.title}>
                <span className="ai-tool-icon">{tool.icon}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <span className="ai-tool-status">Coming soon</span>
              </article>
            ))}
          </section>

          <section className="ai-info-card">
            <h3>How it works</h3>
            <ol>
              <li>Write your idea</li>
              <li>Let AI improve it</li>
              <li>Review and publish</li>
            </ol>
          </section>

          <section className="ai-info-card">
            <h3>Tips for better posts</h3>
            <ul>
              <li>Keep captions clear and focused on one idea.</li>
              <li>Use a few hashtags that are relevant to your post.</li>
              <li>Schedule posts for when your audience is online.</li>
            </ul>
          </section>

          <div className="ai-actions">
            <button type="button" className="ai-button-dark" onClick={() => navigate("/createpage")}>Go to Create page</button>
            <button type="button" className="ai-button-light" onClick={() => navigate("/dashboard")}>Back to dashboard</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiToolsPage
