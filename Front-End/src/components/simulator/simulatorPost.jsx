import { useState } from "react"
import { useAuth } from "../AuthContext/authContext.jsx"
import getInitials from "../../utils/getInitials.js"
import { formatCount, getFakeStats, timeAgo } from "../../utils/fakeStats.js"

const platformNames = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  x: "X",
}

const platformIcons = {
  instagram: "◎",
  facebook: "f",
  linkedin: "in",
  tiktok: "♪",
  x: "𝕏",
}

function CaptionText({ caption }) {
  const parts = (caption || "").split(/(#[\w]+)/g)

  return parts.map((part, index) => (
    part.startsWith("#")
      ? <strong className="sim-hashtag" key={`${part}-${index}`}>{part}</strong>
      : part
  ))
}

function PostMedia({ media }) {
  const images = (media || []).filter((item) => item?.url).slice(0, 4)
  const extraImages = Math.max((media || []).length - 4, 0)

  if (!images.length) return null

  return (
    <div className={`sim-media-grid sim-media-grid--${images.length}`}>
      {images.map((image, index) => (
        <div className="sim-media-item" key={image.publicId || image.url}>
          <img src={image.url} alt="" />
          {index === images.length - 1 && extraImages > 0 && (
            <span className="sim-media-more">+{extraImages}</span>
          )}
        </div>
      ))}
    </div>
  )
}

function ActionButton({ label, count, liked, onLike }) {
  const isLike = label === "Like"
  const icon = label === "Like" ? "♥" : label === "Comment" ? "▢" : label === "Share" ? "↗" : label === "Repost" ? "⟳" : "➤"

  return (
    <button
      type="button"
      className={`sim-action-button${isLike && liked ? " sim-action-button--liked" : ""}`}
      onClick={isLike ? onLike : undefined}
      title={isLike ? undefined : "Demo only"}
    >
      <span className="sim-action-icon">{icon}</span>
      {label}
      {typeof count === "number" && <span>{formatCount(count)}</span>}
    </button>
  )
}

function SimulatorPost({ post, platform }) {
  const { user } = useAuth()
  const displayName = typeof user?.name === "string" && user.name.trim() ? user.name.trim() : "User"
  const handle = `@${displayName.replace(/\s+/g, "").toLowerCase()}`
  const stats = getFakeStats(post._id, platform)
  const [liked, setLiked] = useState(false)
  const likes = stats.likes + (liked ? 1 : 0)
  const nameClass = platform === "instagram" ? "sim-instagram-caption" : "sim-caption"
  const displayedTime = timeAgo(post.publishedAt || post.updatedAt)
  const media = <PostMedia media={post.media} />

  return (
    <article className={`sim-card sim-card--${platform || "default"}`}>
      <span className="sim-badge">Simulated</span>

      <header className="sim-card-header">
        <div className="sim-avatar">{getInitials(displayName)}</div>
        <div className="sim-user-info">
          <strong>{displayName}</strong>
          {platform === "linkedin" ? (
            <>
              <small>Socialynk member</small>
              <small>{handle} · {displayedTime}</small>
            </>
          ) : (
            <small>{handle} · {displayedTime}</small>
          )}
        </div>
        <span className="sim-platform-chip">
          <span>{platformIcons[platform] || "•"}</span>
          {platformNames[platform] || platform}
        </span>
      </header>

      {platform !== "instagram" && (
        <div className="sim-caption">
          <CaptionText caption={post.caption} />
        </div>
      )}

      {platform === "instagram" && media}
      {platform !== "instagram" && media}

      {platform === "instagram" && (
        <div className="sim-instagram-likes">{formatCount(likes)} likes</div>
      )}
      {platform === "instagram" && (
        <div className={nameClass}>
          <strong>{displayName}</strong>{" "}
          <CaptionText caption={post.caption} />
        </div>
      )}

      {platform === "facebook" && (
        <div className="sim-facebook-summary">
          <span>👍 ❤️ {formatCount(likes)}</span>
          <span>{formatCount(stats.comments)} comments · {formatCount(stats.shares)} shares</span>
        </div>
      )}

      {platform === "linkedin" && (
        <div className="sim-linkedin-summary">
          <span>{formatCount(likes)} reactions</span>
          <span>{formatCount(stats.comments)} comments</span>
        </div>
      )}

      {platform === "x" ? (
        <>
          <div className="sim-x-stats">
            <span>{formatCount(stats.comments)} replies</span>
            <span>{formatCount(stats.shares)} reposts</span>
            <span>{formatCount(likes)} likes</span>
            <span>{formatCount(stats.views)} views</span>
          </div>
          <div className="sim-actions">
            <ActionButton label="Like" count={likes} liked={liked} onLike={() => setLiked((current) => !current)} />
            <ActionButton label="Comment" count={stats.comments} />
            <ActionButton label="Share" count={stats.shares} />
          </div>
        </>
      ) : (
        <div className="sim-actions">
          {platform === "instagram" ? (
            <>
              <ActionButton label="Like" liked={liked} onLike={() => setLiked((current) => !current)} />
              <ActionButton label="Comment" />
              <ActionButton label="Share" />
            </>
          ) : platform === "linkedin" ? (
            <>
              <ActionButton label="Like" count={likes} liked={liked} onLike={() => setLiked((current) => !current)} />
              <ActionButton label="Comment" count={stats.comments} />
              <ActionButton label="Repost" count={stats.shares} />
              <ActionButton label="Send" />
            </>
          ) : (
            <>
              <ActionButton label="Like" count={likes} liked={liked} onLike={() => setLiked((current) => !current)} />
              <ActionButton label="Comment" count={stats.comments} />
              <ActionButton label="Share" count={stats.shares} />
            </>
          )}
        </div>
      )}
    </article>
  )
}

export default SimulatorPost
