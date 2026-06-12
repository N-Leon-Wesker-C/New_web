import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middleware/auth.js'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || `post-${Date.now()}`
}

function articleSelect() {
  return `
    SELECT a.id, a.title, a.slug, a.content, a.published,
           a.created_at, a.updated_at, a.category_id,
           c.slug AS category_slug, c.name AS category_name
    FROM articles a
    JOIN categories c ON c.id = a.category_id
  `
}

export default function adminRouter(db) {
  const router = Router()

  router.post('/login', (req, res) => {
    const { username, password } = req.body || {}
    if (!username || !password) {
      return res.status(400).json({ error: '请输入用户名和密码' })
    }

    const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username)
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, username: admin.username })
  })

  router.use(requireAuth)

  router.get('/articles', (req, res) => {
    const rows = db
      .prepare(`${articleSelect()} ORDER BY a.updated_at DESC`)
      .all()
    res.json(rows)
  })

  router.post('/articles', (req, res) => {
    const { categoryId, title, slug, content, published } = req.body || {}
    if (!categoryId || !title?.trim()) {
      return res.status(400).json({ error: '请选择版块并填写标题' })
    }

    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId)
    if (!category) return res.status(400).json({ error: '版块不存在' })

    const finalSlug = (slug?.trim() || slugify(title)).slice(0, 80)

    try {
      const result = db
        .prepare(
          `INSERT INTO articles (category_id, title, slug, content, published, updated_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`
        )
        .run(categoryId, title.trim(), finalSlug, content || '', published ? 1 : 0)

      const article = db
        .prepare(`${articleSelect()} WHERE a.id = ?`)
        .get(result.lastInsertRowid)
      res.status(201).json(article)
    } catch (e) {
      if (e.message.includes('UNIQUE')) {
        return res.status(400).json({ error: '该版块下 slug 已存在，请换一个' })
      }
      throw e
    }
  })

  router.put('/articles/:id', (req, res) => {
    const id = Number(req.params.id)
    const { categoryId, title, slug, content, published } = req.body || {}

    const existing = db.prepare('SELECT id FROM articles WHERE id = ?').get(id)
    if (!existing) return res.status(404).json({ error: '文章不存在' })

    db.prepare(
      `UPDATE articles SET
         category_id = COALESCE(?, category_id),
         title = COALESCE(?, title),
         slug = COALESCE(?, slug),
         content = COALESCE(?, content),
         published = COALESCE(?, published),
         updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      categoryId ?? null,
      title?.trim() ?? null,
      slug?.trim() ?? null,
      content ?? null,
      published === undefined ? null : published ? 1 : 0,
      id
    )

    const article = db.prepare(`${articleSelect()} WHERE a.id = ?`).get(id)
    res.json(article)
  })

  router.delete('/articles/:id', (req, res) => {
    const id = Number(req.params.id)
    // 先删除该文章的评论
    db.prepare('DELETE FROM comments WHERE article_id = ?').run(id)
    // 再删除文章
    const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id)
    if (!result.changes) return res.status(404).json({ error: '文章不存在' })
    res.json({ ok: true })
  })

  router.get('/comments', (req, res) => {
    const rows = db
      .prepare(
        `SELECT cm.id, cm.author_name, cm.content, cm.approved, cm.created_at,
                a.title AS article_title, a.id AS article_id,
                c.slug AS category_slug, a.slug AS article_slug
         FROM comments cm
         JOIN articles a ON a.id = cm.article_id
         JOIN categories c ON c.id = a.category_id
         ORDER BY cm.created_at DESC`
      )
      .all()
    res.json(rows)
  })

  router.patch('/comments/:id', (req, res) => {
    const id = Number(req.params.id)
    const { approved, delete: shouldDelete } = req.body || {}

    if (shouldDelete) {
      const result = db.prepare('DELETE FROM comments WHERE id = ?').run(id)
      if (!result.changes) return res.status(404).json({ error: '评论不存在' })
      return res.json({ ok: true })
    }

    if (approved === undefined) {
      return res.status(400).json({ error: '缺少 approved 参数' })
    }

    const result = db
      .prepare('UPDATE comments SET approved = ? WHERE id = ?')
      .run(approved ? 1 : 0, id)

    if (!result.changes) return res.status(404).json({ error: '评论不存在' })
    res.json({ ok: true })
  })

  return router
}
