import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'site.db');

console.log('检查文章数据...');

try {
  const db = new Database(dbPath);
  
  const articles = db.prepare('SELECT * FROM articles').all();
  console.log(`\n共有 ${articles.length} 篇文章:`);
  
  articles.forEach(a => {
    console.log(`\nID: ${a.id}`);
    console.log(`  标题: ${a.title}`);
    console.log(`  分类: ${a.category_id}`);
    console.log(`  Slug: ${a.slug}`);
    console.log(`  已发布: ${a.published}`);
    console.log(`  内容长度: ${a.content ? a.content.length : 0}`);
    console.log(`  内容前100字符: ${a.content ? a.content.substring(0, 100) : '无内容'}`);
  });
  
  db.close();
} catch (e) {
  console.error('错误:', e);
}
