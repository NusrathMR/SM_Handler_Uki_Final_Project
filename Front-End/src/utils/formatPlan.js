function formatPlan(plan) {
  if (typeof plan !== "string" || !plan.trim()) return "Free Plan"

  const planName = plan.trim()
  return `${planName[0].toUpperCase()}${planName.slice(1)} Plan`
}

export default formatPlan
