import "./sidebar.css"
import { Link, NavLink } from "react-router-dom";

const links = [
  { name: "Home", icon: "⌂", to: "/dashboard" },
  { name: "Create", icon: "✎", to: "/createpage" },
  { name: "Publish", icon: "▦", to: "/publishpage" },
  { name: "Templates", icon: "▣" },
  { name: "Pricing", icon: "▬" },
];

const channels = ["◎", "👍", "#", "▣", "♪", "▶"];

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div>
        {/* Brand */}
        <div className="db-brand">
          <span className="db-logo">✦</span>
          <div>
            <strong>Socialynk</strong>
            <small>ENTERPRISE SUITE</small>
          </div>
        </div>

        <Link to="/createpage" className="db-create-btn">+ Create New</Link>

        {/* Menu */}
        <nav className="db-menu">
          {links.map((link) => (
            link.to ? (
              <NavLink key={link.name} to={link.to}>
                {link.icon} {link.name}
              </NavLink>
            ) : (
              <Link
                key={link.name}
                to="#"
                onClick={(event) => event.preventDefault()}
              >
                {link.icon} {link.name}
              </Link>
            )
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