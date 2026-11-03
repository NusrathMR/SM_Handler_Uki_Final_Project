import axios from "axios"

const api = axios.create({
  baseURL: "https://socialynk-uki-final-project.onrender.com/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

export function generateCaption(prompt, signal) {
  const token = localStorage.getItem("token")
  const headers = { "Content-Type": "application/json" }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(`${api.defaults.baseURL}/ai/generate-caption`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt }),
    signal,
  })
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append("image", file)

  const response = await api.post("/media/upload", formData, {
    validateStatus: () => true,
  })

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.data.message)
  }

  return response.data.media
}

export async function deleteImage(publicId) {
  const response = await api.delete("/media", {
    data: { publicId },
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  })

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.data.message)
  }

  return response.data
}

export async function getAdminSettings() {
  const response = await api.get("/admin/settings", {
    validateStatus: () => true,
  })

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.data?.message || "Could not load settings")
  }

  return response.data.settings
}

export async function saveAdminSettings(settings) {
  const response = await api.put("/admin/settings", settings, {
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  })

  if (response.status < 200 || response.status >= 300) {
    const error = new Error(response.data?.message || "Could not save settings")
    error.fieldErrors = response.data?.errors || {}
    throw error
  }

  return response.data.settings
}
