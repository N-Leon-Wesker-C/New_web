import { Router } from 'express'

function articleSelect() {
  return `
    SELECT a.id, a.title, a.slug, a.content, a.published,
           a.created_at, a.updated_at,
           c.slug AS category_slug, c.name AS category_name
    FROM articles a
    JOIN categories c ON c.id = a.category_id
  `
}

export default function articlesRouter(db) {
  const router = Router()

  router.get('/', (req, res) => {
    const { category } = req.query
    if (!category) {
      return res.status(400).json({ error: '缺少 category 参数' })
    }

    const rows = db
      .prepare(`${articleSelect()} WHERE c.slug = ? AND a.published = 1 ORDER BY a.created_at DESC`)
      .all(category)
    res.json(rows)
  })

  router.get('/detail', (req, res) => {
    const { category, slug } = req.query
    if (!category || !slug) {
      return res.status(400).json({ error: '缺少 category 或 slug 参数' })
    }

    const row = db
      .prepare(`${articleSelect()} WHERE c.slug = ? AND a.slug = ? AND a.published = 1`)
      .get(category, slug)

    if (!row) return res.status(404).json({ error: '文章不存在' })
    res.json(row)
  })

  return router
}
