import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { rateLimit } from '../middleware/rateLimit.js'

function getUserFromToken(header, db) {
  if (!header?.startsWith('Bearer ')) return null
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    if (decoded.role === 'user') {
      return db.prepare('SELECT id, username FROM users WHERE id = ?').get(decoded.userId)
    }
    return null
  } catch {
    return null
  }
}

export default function commentsRouter(db) {
  const router = Router({ mergeParams: true })

  router.get('/:articleId', (req, res) => {
    const articleId = Number(req.params.articleId)
    const rows = db
      .prepare(
        `SELECT id, author_name, content, created_at, user_id
         FROM comments WHERE article_id = ? AND approved = 1
         ORDER BY created_at ASC`
      )
      .all(articleId)
    res.json(rows)
  })

  router.post(
    '/:articleId',
    rateLimit({ windowMs: 60000, max: 5 }),
    (req, res) => {
      const articleId = Number(req.params.articleId)
      const { authorName, content, website } = req.body || {}

      if (website) {
        return res.json({ ok: true, message: '评论已提交，等待审核' })
      }

      const user = getUserFromToken(req.headers.authorization, db)

      if (user) {
        if (!content?.trim()) {
          return res.status(400).json({ error: '请填写评论内容' })
        }
        if (content.length > 500) {
          return res.status(400).json({ error: '评论内容过长' })
        }

        const article = db.prepare('SELECT id FROM articles WHERE id = ? AND published = 1').get(articleId)
        if (!article) return res.status(404).json({ error: '文章不存在' })

        const requireApproval = process.env.COMMENT_REQUIRE_APPROVAL !== 'false'
        const approved = requireApproval ? 0 : 1

        db.prepare(
          'INSERT INTO comments (article_id, user_id, author_name, content, approved) VALUES (?, ?, ?, ?, ?)'
        ).run(articleId, user.id, user.username, content.trim(), approved)

        const message = requireApproval
          ? '评论已提交，审核通过后将显示'
          : '评论发表成功'

        res.json({ ok: true, message })
      } else {
        if (!authorName?.trim() || !content?.trim()) {
          return res.status(400).json({ error: '请填写昵称和评论内容' })
        }
        if (authorName.length > 50 || content.length > 500) {
          return res.status(400).json({ error: '昵称或评论内容过长' })
        }

        const article = db.prepare('SELECT id FROM articles WHERE id = ? AND published = 1').get(articleId)
        if (!article) return res.status(404).json({ error: '文章不存在' })

        const requireApproval = process.env.COMMENT_REQUIRE_APPROVAL !== 'false'
        const approved = requireApproval ? 0 : 1

        db.prepare(
          'INSERT INTO comments (article_id, author_name, content, approved) VALUES (?, ?, ?, ?)'
        ).run(articleId, authorName.trim(), content.trim(), approved)

        const message = requireApproval
          ? '评论已提交，审核通过后将显示'
          : '评论发表成功'

        res.json({ ok: true, message })
      }
    }
  )

  return router
}
