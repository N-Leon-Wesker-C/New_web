const hits = new Map()

export function rateLimit({ windowMs = 60000, max = 5 } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    const bucket = hits.get(key) || []
    const recent = bucket.filter((t) => now - t < windowMs)

    if (recent.length >= max) {
      return res.status(429).json({ error: '操作太频繁，请稍后再试' })
    }

    recent.push(now)
    hits.set(key, recent)
    next()
  }
}
