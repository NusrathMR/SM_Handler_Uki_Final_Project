import { useState, useEffect } from "react";
import api from "../../api/api.js";
import Sidebar from "../sideBar/sidebar.jsx";
import TopBar from "../topBar/topBar.jsx";
import "./publishPage.css";

const tabs = ["Schedule", "Drafts", "Sent"];

const initialPlatforms = [
  { id: "instagram", name: "Instagram", icon: "◎", on: true },
  { id: "facebook", name: "Facebook", icon: "👍", on: true },
  { id: "x", name: "X", icon: "#", on: true },
  { id: "linkedin", name: "LinkedIn", icon: "▣", on: true },
  { id: "youtube", name: "YouTube", icon: "▶", on: false, disabled: true },
];

const PLATFORM_ICONS = { instagram: "◎", facebook: "👍", linkedin: "▣", x: "#", tiktok: "♪" };
const STATUS_LABELS = { draft: "Draft", scheduled: "Scheduled", publishing: "Publishing", published: "Sent", failed: "Failed" };

function dayLabel(date) {
  const day = new Date(date);
  const today = new Date();
  day.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const difference = Math.round((day - today) / (24 * 60 * 60 * 1000));

  if (difference === 0) return "TODAY";
  if (difference === 1) return "TOMORROW";
  if (difference === -1) return "YESTERDAY";
  return day.toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase();
}

function toCard(post) {
  const when = new Date(post.scheduledAt || post.publishedAt || post.updatedAt);
  const caption = post.caption || "";

  return {
    id: post._id,
    day: dayLabel(when),
    date: when.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    title: caption ? (caption.length > 60 ? caption.slice(0, 60) + "..." : caption) : "Untitled post",
    text: caption,
    status: STATUS_LABELS[post.status] || post.status,
    icons: post.platforms.map((platform) => PLATFORM_ICONS[platform]).filter(Boolean).join(" "),
    img: null,
  };
}

function PublishPage() {
  const [activeTab, setActiveTab] = useState("Schedule");
  const [view, setView] = useState("list");           // "list" or "calendar"
  const [posts, setPosts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  async function loadPosts() {
    try {
      const response = await api.get("/posts?status=scheduled,publishing&sort=scheduledAt&limit=50");
      setPosts(response.data.posts.map(toCard));
      setLoadError(false);
    } catch (error) {
      console.error("Could not load posts", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) {
      setSelectedId(null);
    } else if (!posts.some((post) => post.id === selectedId)) {
      setSelectedId(posts[0].id);
    }
  }, [posts]);

  // The post shown in the preview panel
  const selectedPost = posts.find((p) => p.id === selectedId);

  // Filter the list by the search text
  const visiblePosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  async function deletePost(e, id) {
    e.stopPropagation();
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      loadPosts();
    } catch (error) {
      alert(error.response?.data?.message || "Could not delete the post...");
    }
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
              {tab}
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
                    {post.img && <img className="pb-thumb" src={post.img} alt="" />}
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
                {loading ? (
                  <p className="pb-empty">Loading posts...</p>
                ) : loadError ? (
                  <p className="pb-empty">Could not load posts.</p>
                ) : posts.length === 0 ? (
                  <p className="pb-empty">No scheduled posts yet.</p>
                ) : visiblePosts.length === 0 ? (
                  <p className="pb-empty">No posts found.</p>
                ) : null}
              </div>
            ) : (
              <p className="pb-empty">Calendar view coming soon.</p>
            )}

            <button type="button" className="pb-add">+ Add More Scheduled Posts</button>

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

                  {selectedPost.img && (
                    <div className="pb-preview-img">
                      <img src={selectedPost.img} alt="" />
                      <div className="pb-preview-caption">
                        <strong>{selectedPost.title}</strong>
                        <small>Smarter • Faster • Together</small>
                      </div>
                    </div>
                  )}

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