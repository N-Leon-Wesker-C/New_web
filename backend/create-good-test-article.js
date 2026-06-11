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
  
  // 选择技术分类
  const category = categories.find(c => c.slug === 'blog/tech');
  
  // 插入测试文章
  const result = db.prepare(`
    INSERT INTO articles (category_id, title, slug, content, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    category.id,
    '欢迎使用博客',
    'welcome',
    '# 欢迎使用博客系统 🎉\n\n这是一个功能完整的博客系统，支持以下功能：\n\n## 功能列表\n\n1. **用户注册和登录**\n2. **管理员后台**\n3. **Markdown文章编辑**\n4. **评论系统**\n5. **响应式设计**\n\n## 如何使用\n\n1. 点击导航栏的\"管理后台\"\n2. 使用管理员账号登录\n3. 开始发布你的文章！\n\n祝你使用愉快！',
    1
  );
  
  console.log('\n✓ 测试文章创建成功!');
  console.log('  文章ID:', result.lastInsertRowid);
  
  // 验证一下
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid);
  console.log('  标题:', article.title);
  console.log('  内容长度:', article.content ? article.content.length : 0, '字符');
  console.log('  内容预览:', article.content ? article.content.substring(0, 50) + '...' : '无内容');
  
  db.close();
} catch (e) {
  console.error('错误:', e);
}
