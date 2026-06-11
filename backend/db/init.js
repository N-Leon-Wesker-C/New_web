import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'site.db')

export function getDb() {
  return new Database(dbPath)
}

export function initDatabase() {
  fs.mkdirSync(__dirname, { recursive: true })
  const db = getDb()

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      UNIQUE(category_id, slug)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      user_id INTEGER,
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      approved INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  const categories = [
    { slug: 'career/papers', name: '论文', description: '学术论文与阅读笔记' },
    { slug: 'career/projects', name: '项目', description: '项目经历与实践' },
    { slug: 'career/technology', name: '技术', description: '技术探索与工具' },
    { slug: 'career/investment', name: '投资', description: '投资相关思考' },
    { slug: 'blog/art', name: '艺术', description: '音乐、电影与艺术' },
    { slug: 'blog/thoughts', name: '思考', description: '深入思考与见解' },
    { slug: 'blog/essay', name: '随笔', description: '随笔与日常感悟' },
    { slug: 'blog/tech', name: '技术', description: '技术相关博客' },
    { slug: 'blog/travel', name: '旅行', description: '旅行记录与分享' },
  ]

  const insertCategory = db.prepare(
    'INSERT OR IGNORE INTO categories (slug, name, description) VALUES (?, ?, ?)'
  )
  for (const c of categories) {
    insertCategory.run(c.slug, c.name, c.description)
  }

  const adminCount = db.prepare('SELECT COUNT(*) AS n FROM admin').get().n
  if (adminCount === 0) {
    const username = process.env.ADMIN_USERNAME || 'niechang'
    const password = process.env.ADMIN_PASSWORD || 'change-me'
    const hash = bcrypt.hashSync(password, 10)
    db.prepare('INSERT INTO admin (username, password_hash) VALUES (?, ?)').run(username, hash)
    console.log(`Admin created: username="${username}"`)
  }

  return db
}
