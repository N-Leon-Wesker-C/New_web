import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { rateLimit } from '../middleware/rateLimit.js'

export default function usersRouter(db) {
  const router = Router()

  router.post('/register', rateLimit({ windowMs: 60000, max: 20 }), async (req, res) => {
    console.log('注册请求收到:', req.body);
    const { email, username, password } = req.body;

    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: '请填写邮箱、用户名和密码' });
    }

    if (email.length > 100 || username.length > 50 || password.length < 6) {
      return res.status(400).json({ error: '用户名或邮箱过长，密码至少6位' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '请输入有效的邮箱地址' });
    }

    try {
      const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim());
      if (existingEmail) {
        return res.status(400).json({ error: '该邮箱已被注册' });
      }

      const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim());
      if (existingUsername) {
        return res.status(400).json({ error: '该用户名已被使用' });
      }

      const passwordHash = bcrypt.hashSync(password.trim(), 10);
      const result = db
        .prepare('INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)')
        .run(email.trim(), username.trim(), passwordHash);

      const token = jwt.sign(
        { userId: result.lastInsertRowid, username: username.trim(), role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('注册成功:', username.trim());
      res.json({
        ok: true,
        token,
        user: { id: result.lastInsertRowid, username: username.trim(), email: email.trim(), role: 'user' }
      });
    } catch (error) {
      console.error('注册错误:', error);
      res.status(500).json({ error: '注册失败，请稍后重试' });
    }
  })

  router.post('/login', rateLimit({ windowMs: 60000, max: 10 }), (req, res) => {
    const { email, password } = req.body
    const identifier = email?.trim()

    if (!identifier || !password?.trim()) {
      return res.status(400).json({ error: '请填写账号和密码' })
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(identifier, identifier)
    if (!user) {
      return res.status(401).json({ error: '账号或密码错误' })
    }

    const passwordValid = bcrypt.compareSync(password.trim(), user.password_hash)
    if (!passwordValid) {
      return res.status(401).json({ error: '账号或密码错误' })
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      ok: true,
      token,
      user: { id: user.id, username: user.username, email: user.email, role: 'user' }
    })
  })

  router.get('/profile', (req, res) => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未登录' })
    }

    try {
      const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET)
      if (decoded.role !== 'user') {
        return res.status(401).json({ error: '无效的用户身份' })
      }

      const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(decoded.userId)
      if (!user) {
        return res.status(404).json({ error: '用户不存在' })
      }

      res.json({ ok: true, user: { ...user, role: 'user' } })
    } catch {
      res.status(401).json({ error: '登录已过期，请重新登录' })
    }
  })

  return router
}
