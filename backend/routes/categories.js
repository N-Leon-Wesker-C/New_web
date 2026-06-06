import { Router } from 'express'

export default function categoriesRouter(db) {
  const router = Router()

  router.get('/', (req, res) => {
    const rows = db.prepare('SELECT id, slug, name, description FROM categories ORDER BY id').all()
    res.json(rows)
  })

  router.get('/lookup', (req, res) => {
    const { slug } = req.query
    if (!slug) return res.status(400).json({ error: '缺少 slug 参数' })
    const row = db
      .prepare('SELECT id, slug, name, description FROM categories WHERE slug = ?')
      .get(slug)
    if (!row) return res.status(404).json({ error: '版块不存在' })
    res.json(row)
  })

  return router
}
