import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDatabase } from './db/init.js'
import categoriesRouter from './routes/categories.js'
import articlesRouter from './routes/articles.js'
import commentsRouter from './routes/comments.js'
import adminRouter from './routes/admin.js'

if (!process.env.JWT_SECRET) {
  console.error('请设置 JWT_SECRET 环境变量（见 .env.example）')
  process.exit(1)
}

const db = initDatabase()
const app = express()
const port = Number(process.env.PORT) || 3000

app.set('trust proxy', 1)
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/categories', categoriesRouter(db))
app.use('/api/articles', articlesRouter(db))
app.use('/api/comments', commentsRouter(db))
app.use('/api/admin', adminRouter(db))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: '服务器内部错误' })
})

app.listen(port, '127.0.0.1', () => {
  console.log(`API running at http://127.0.0.1:${port}`)
})
