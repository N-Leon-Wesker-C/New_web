const ADMIN_TOKEN_KEY = 'admin_token'
const USER_TOKEN_KEY = 'user_token'
const USER_KEY = 'user_info'
// 关键修改：BASE_URL 改为空字符串，让请求直接走当前域名的 /api
const BASE_URL = ''

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}
export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}
export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}
export function getUserToken() {
  return localStorage.getItem(USER_TOKEN_KEY)
}
export function setUserToken(token) {
  localStorage.setItem(USER_TOKEN_KEY, token)
}
export function clearUserToken() {
  localStorage.removeItem(USER_TOKEN_KEY)
}
export function getUser() {
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}
export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export function clearUser() {
  localStorage.removeItem(USER_KEY)
}
export function getToken() {
  return getUserToken() || getAdminToken()
}

async function request(path, options = {}) {
  const fullUrl = BASE_URL + path
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: 'include' // 必须保留，登录会话必备
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || '请求失败')
  }
  return data
}

export const api = {
  getCategories: () => request('/api/categories'),
  getCategory: (slug) => request(`/api/categories/lookup?slug=${encodeURIComponent(slug)}`),
  getArticles: (category) => request(`/api/articles?category=${encodeURIComponent(category)}`),
  getArticle: (category, slug) =>
    request(`/api/articles/detail?category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`),
  getComments: (articleId) => request(`/api/comments/${articleId}`),
  postComment: (articleId, body) =>
    request(`/api/comments/${articleId}`, { method: 'POST', body: JSON.stringify(body) }),
  userRegister: (email, username, password) =>
    request('/api/users/register', { method: 'POST', body: JSON.stringify({ email, username, password }) }),
  userLogin: (email, password) =>
    request('/api/users/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  userProfile: () => request('/api/users/profile'),
  adminLogin: (username, password) =>
    request('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  adminGetArticles: () => request('/api/admin/articles'),
  adminCreateArticle: (body) =>
    request('/api/admin/articles', { method: 'POST', body: JSON.stringify(body) }),
  adminUpdateArticle: (id, body) =>
    request(`/api/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  adminDeleteArticle: (id) =>
    request(`/api/admin/articles/${id}`, { method: 'DELETE' }),
  adminGetComments: () => request('/api/admin/comments'),
  adminPatchComment: (id, body) =>
    request(`/api/admin/comments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}