import { useState } from "react";
import Sidebar from "../sideBar/sidebar.jsx";
import TopBar from "../topBar/topBar.jsx";
import "./publishPage.css";

const tabs = ["Schedule", "Drafts", "Approvals", "Sent"];

const initialPosts = [
  {
    id: 1, day: "TODAY", date: "Sep 23", time: "5:00 PM",
    title: "The future of technology is closer than you think",
    text: "The future of technology is closer than you think. Let's build it together. #Innovation #Tech #Socialynk",
    status: "Ready", icons: "◎ 👍 # ▣",
    img: "https://picsum.photos/600/340?grayscale&random=1",
  },
  {
    id: 2, day: "TOMORROW", date: "Sep 24", time: "9:00 AM",
    title: "Small steps. Big changes. Sustainable growth",
    text: "Small steps. Big changes. Sustainable growth starts today. #Growth #Sustainability",
    status: "Queued", icons: "◎ 👍 #",
    img: "https://picsum.photos/600/340?grayscale&random=2",
  },
  {
    id: 3, day: "TOMORROW", date: "Sep 24", time: "1:00 PM",
    title: "Introducing AI Post Scheduler v3.0: Smart timing",
    text: "Introducing AI Post Scheduler v3.0. Smart timing for every post. #AI #Scheduling",
    status: "Queued", icons: "# ▣ 👍",
    img: "https://picsum.photos/600/340?grayscale&random=3",
  },
  {
    id: 4, day: "FRIDAY", date: "Sep 25", time: "5:00 PM",
    title: "Weekly creator analytics breakdown: How content performs",
    text: "Weekly creator analytics breakdown. See how your content performs. #Analytics #Creators",
    status: "Scheduled", icons: "◎ ▣ ♪",
    img: "https://picsum.photos/600/340?grayscale&random=4",
  },
];

const initialPlatforms = [
  { id: "instagram", name: "Instagram", icon: "◎", on: true },
  { id: "facebook", name: "Facebook", icon: "👍", on: true },
  { id: "x", name: "X", icon: "#", on: true },
  { id: "linkedin", name: "LinkedIn", icon: "▣", on: true },
  { id: "youtube", name: "YouTube", icon: "▶", on: false, disabled: true },
];

function PublishPage() {
  const [activeTab, setActiveTab] = useState("Schedule");
  const [view, setView] = useState("list");           // "list" or "calendar"
  const [posts, setPosts] = useState(initialPosts);
  const [selectedId, setSelectedId] = useState(1);
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [search, setSearch] = useState("");

  // The post shown in the preview panel
  const selectedPost = posts.find((p) => p.id === selectedId);

  // Filter the list by the search text
  const visiblePosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  function deletePost(e, id) {
    e.stopPropagation(); // do not also select the post
    const left = posts.filter((p) => p.id !== id);
    setPosts(left);
    if (id === selectedId) setSelectedId(left[0]?.id ?? null);
  }

  function togglePlatform(id) {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, on: !p.on } : p))
    );
  }

  function handleSchedule() {
    const channels = platforms.filter((p) => p.on).map((p) => p.id);
    console.log("Schedule post:", selectedPost, "to", channels);
    // call your API here
  }

  return (
    <div className="db-layout">
      <Sidebar />

      <div className="pb-wrap">

        <TopBar
          title="Publish"
          subtitle="Schedule your content and reach your audience across multiple platforms."
          titleIcon="▷"
          searchValue={search}
          onSearchChange={setSearch}
        />

        {/* Tabs */}
        <nav className="pb-tabs">
          {tabs.map((tab) => (
            <a
              key={tab}
              href="#"
              className={activeTab === tab ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab);
              }}
            >
              {tab} {tab === "Approvals" && <b>2</b>}
            </a>
          ))}
        </nav>

        <div className="pb-body">

          {/* Left column */}
          <div className="pb-left">
            <div className="pb-head">
              <div>
                <h2>{activeTab}</h2>
                <p>Choose when you want to publish your content.</p>
              </div>
              <div className="pb-view">
                <button
                  type="button"
                  className={view === "list" ? "active" : ""}
                  onClick={() => setView("list")}
                >
                  ☰ List
                </button>
                <button
                  type="button"
                  className={view === "calendar" ? "active" : ""}
                  onClick={() => setView("calendar")}
                >
                  ▦ Calendar
                </button>
              </div>
            </div>

            {view === "list" ? (
              <div className="pb-list">
                {visiblePosts.map((post) => (
                  <div
                    key={post.id}
                    className={"pb-post" + (post.id === selectedId ? " active" : "")}
                    onClick={() => setSelectedId(post.id)}
                  >
                    <div className="pb-date">
                      <small>{post.day}</small>
                      <strong>{post.date}</strong>
                      <span>{post.time}</span>
                    </div>
                    <img className="pb-thumb" src={post.img} alt="" />
                    <div className="pb-post-info">
                      <h4>{post.title}</h4>
                      <div className="pb-post-meta">
                        <span>{post.icons}</span>
                        <i>•</i>
                        <span className="pb-status">{post.status}</span>
                      </div>
                    </div>
                    <div className="pb-post-actions">
                      <button type="button">✎</button>
                      <button type="button" onClick={(e) => deletePost(e, post.id)}>🗑</button>
                      <button type="button">⋮</button>
                    </div>
                  </div>
                ))}
                {visiblePosts.length === 0 && <p className="pb-empty">No posts found.</p>}
              </div>
            ) : (
              <p className="pb-empty">Calendar view coming soon.</p>
            )}

            <button type="button" className="pb-add">+ Add More Scheduled Posts</button>

            <h3 className="pb-sub">Quick Actions</h3>
            <div className="pb-quick">
              <div className="pb-qcard">
                <span className="pb-qicon">✦</span>
                <h4>AI Suggestions</h4>
                <p>Get the best time to post</p>
                <a href="#">Optimize times →</a>
              </div>
              <div className="pb-qcard">
                <span className="pb-qicon">▦</span>
                <h4>Bulk Schedule</h4>
                <p>Schedule multiple posts</p>
                <a href="#">Open queue →</a>
              </div>
              <div className="pb-qcard">
                <span className="pb-qicon">▤</span>
                <h4>Import from CSV</h4>
                <p>Upload your content</p>
                <a href="#">Select file →</a>
              </div>
            </div>

            <button type="button" className="pb-schedule-btn" onClick={handleSchedule}>
              Schedule Post →
            </button>
          </div>

          {/* Right column */}
          <aside className="pb-right">

            {selectedPost && (
              <div className="pb-panel">
                <div className="pb-panel-head">
                  <h3>◉ Post Preview</h3>
                  <a href="#">✎ Edit</a>
                </div>

                <div className="pb-preview">
                  <div className="pb-preview-top">
                    <span className="pb-preview-logo">✦</span>
                    <div>
                      <strong>Socialynk ✔</strong>
                      <small>Just now</small>
                    </div>
                    <span className="pb-preview-dots">···</span>
                  </div>

                  <p>{selectedPost.text}</p>

                  <div className="pb-preview-img">
                    <img src={selectedPost.img} alt="" />
                    <div className="pb-preview-caption">
                      <strong>{selectedPost.title}</strong>
                      <small>Smarter • Faster • Together</small>
                    </div>
                  </div>

                  <div className="pb-preview-stats">
                    <span>♡ 1.4K</span>
                    <span>▭ 248</span>
                    <span>➦ 89</span>
                    <span className="pb-save">⚑</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pb-platforms">
              <h4>Selected Platforms</h4>
              {platforms.map((p) => (
                <div key={p.id} className={"pb-platform" + (p.disabled ? " off" : "")}>
                  <span>{p.icon} {p.name}</span>
                  <label className="pb-switch">
                    <input
                      type="checkbox"
                      checked={p.on}
                      disabled={p.disabled}
                      onChange={() => togglePlatform(p.id)}
                    />
                    <i></i>
                  </label>
                </div>
              ))}
            </div>

            <div className="pb-reach">
              <div className="pb-reach-top">
                <h4>∿ Estimated Reach</h4>
                <span className="pb-chip">+28.4%</span>
              </div>
              <p className="pb-reach-num">124.5K - 150K <small>Impressions</small></p>
              <div className="pb-progress"><i></i></div>
              <small className="pb-reach-note">
                Based on your audience and platform activity over the last 30 days.
              </small>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

export default PublishPage;