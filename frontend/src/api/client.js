const TOKEN_KEY = 'admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(path, { ...options, headers })
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

  login: (username, password) =>
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
