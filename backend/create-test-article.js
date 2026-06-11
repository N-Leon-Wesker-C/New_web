import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'site.db');

console.log('创建测试文章...');

try {
  const db = new Database(dbPath);
  
  // 先看看有哪些分类
  const categories = db.prepare('SELECT * FROM categories').all();
  console.log('可用分类:');
  categories.forEach(c => console.log(`  ${c.id}: ${c.name} (${c.slug})`));
  
  // 选第一个分类
  const categoryId = categories[0].id;
  
  // 插入测试文章
  const result = db.prepare(`
    INSERT INTO articles (category_id, title, slug, content, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    categoryId,
    '测试文章',
    'test-article',
    '# 测试文章内容\n\n这是一篇测试文章，用于验证文章发布功能。\n\n## 第一段\n\n这是第一段内容。',
    1
  );
  
  console.log('\n✓ 测试文章创建成功!');
  console.log('  文章ID:', result.lastInsertRowid);
  
  // 验证一下
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid);
  console.log('  标题:', article.title);
  console.log('  已发布:', article.published);
  
  db.close();
} catch (e) {
  console.error('错误:', e);
}
