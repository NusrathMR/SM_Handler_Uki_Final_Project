import "./sidebar.css"

const links = [
  { name: "Home", icon: "⌂", to: "dashboard" },
  { name: "Create", icon: "✎", to: "createpage" },
  { name: "Publish", icon: "▦" },
  { name: "Templates", icon: "▣" },
  { name: "Pricing", icon: "▬" },
];

const channels = ["◎", "👍", "#", "▣", "♪", "▶"];

function Sidebar({ active }) {
  return (
    <aside className="db-sidebar">
      <div>
        {/* Brand */}
        <div className="db-brand">
          <span className="db-logo">✦</span>
          <div>
            <strong>Socialynk</strong>
            <small>ENTERPRISE SUITE</small>
          </div>
        </div>

        <a href="#" className="db-create-btn">+ Create New</a>

        {/* Menu */}
        <nav className="db-menu">
          {links.map((link) => (
            <a
              key={link.name}
              href="#"
              className={active === link.name ? "active" : ""}
            >
              {link.icon} {link.name}
            </a>
          ))}
        </nav>
      </div>

      <div>
        {/* Connected channels */}
        <div className="db-channels-head">
          <span>CONNECTED CHANNELS</span>
          <span>+</span>
        </div>
        <div className="db-channel-icons">
          {channels.map((icon, i) => (
            <i key={i}>{icon}</i>
          ))}
        </div>

        {/* User card */}
        <div className="db-user-card">
          <span className="db-avatar-light">MA</span>
          <div>
            <strong>M. R. Nusrat Ahmed</strong>
            <small>Free Plan</small>
          </div>
          <span className="db-dots">⇅</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;