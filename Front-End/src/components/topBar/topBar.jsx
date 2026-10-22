import { useAuth } from "../AuthContext/authContext.jsx";
import "./topBar.css";

function TopBar({
  title,
  subtitle,
  titleIcon,
  searchShortcut,
  searchValue,
  onSearchChange,
}) {
  const { user } = useAuth();
  const emailPrefix = typeof user?.email === "string"
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "";
  const initials = emailPrefix || "?";
  const profilePicture = typeof user?.profilePicture === "string"
    ? user.profilePicture.trim()
    : "";

  return (
    <header className="top-bar">
      <div className="top-bar-heading">
        {titleIcon && <span className="top-bar-title-icon">{titleIcon}</span>}
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="top-bar-actions">
        <label className="top-bar-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search anything..."
            value={searchValue}
            onChange={onSearchChange
              ? (event) => onSearchChange(event.target.value)
              : undefined}
          />
          {searchShortcut && <kbd>{searchShortcut}</kbd>}
        </label>
        <button type="button" className="top-bar-bell" aria-label="Notifications">
          🔔
        </button>
        <span className="top-bar-avatar">
          {profilePicture
            ? <img src={profilePicture} alt="" />
            : initials}
        </span>
      </div>
    </header>
  );
}

export default TopBar;
