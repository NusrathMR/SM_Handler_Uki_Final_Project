const platformRanges = {
  instagram: {
    likes: [20, 900],
    comments: [2, 80],
    shares: [0, 60],
    views: [400, 20000],
  },
  facebook: {
    likes: [30, 1200],
    comments: [3, 100],
    shares: [1, 100],
    views: [500, 30000],
  },
  linkedin: {
    likes: [10, 500],
    comments: [1, 50],
    shares: [0, 40],
    views: [200, 15000],
  },
  tiktok: {
    likes: [50, 3000],
    comments: [5, 200],
    shares: [2, 150],
    views: [1000, 100000],
  },
  x: {
    likes: [5, 700],
    comments: [1, 60],
    shares: [0, 80],
    views: [100, 25000],
  },
}

function hash(value) {
  let result = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 16777619)
  }

  return result >>> 0
}

function getValue(seed, metric, range) {
  const value = hash(`${seed}:${metric}`)
  const [minimum, maximum] = range
  return minimum + (value % (maximum - minimum + 1))
}

export function getFakeStats(postId, platform) {
  const ranges = platformRanges[platform] || platformRanges.instagram
  const seed = `${postId}-${platform}`

  return {
    likes: getValue(seed, "likes", ranges.likes),
    comments: getValue(seed, "comments", ranges.comments),
    shares: getValue(seed, "shares", ranges.shares),
    views: getValue(seed, "views", ranges.views),
  }
}

export function formatCount(number) {
  const count = Number(number)
  if (!Number.isFinite(count)) return "0"
  if (count < 1000) return String(Math.round(count))

  const suffix = count >= 1000000 ? "M" : "K"
  const divisor = count >= 1000000 ? 1000000 : 1000
  const formatted = (count / divisor).toFixed(1).replace(/\.0$/, "")

  return `${formatted}${suffix}`
}

export function timeAgo(dateString) {
  if (!dateString) return "Just now"

  const date = new Date(dateString)
  const timestamp = date.getTime()
  if (Number.isNaN(timestamp)) return "Just now"

  const difference = Date.now() - timestamp
  if (difference < 0 || difference < 60 * 1000) return "Just now"

  const minutes = Math.floor(difference / (60 * 1000))
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`

  const hours = Math.floor(difference / (60 * 60 * 1000))
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.floor(difference / (24 * 60 * 60 * 1000))
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}
