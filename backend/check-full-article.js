import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'site.db');

console.log('详细检查文章数据...\n');

try {
  const db = new Database(dbPath);
  
  const articles = db.prepare('SELECT * FROM articles').all();
  console.log(`共有 ${articles.length} 篇文章:`);
  
  articles.forEach(a => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`ID: ${a.id}`);
    console.log(`标题: ${a.title}`);
    console.log(`分类ID: ${a.category_id}`);
    console.log(`Slug: ${a.slug}`);
    console.log(`已发布: ${a.published}`);
    console.log(`内容长度: ${a.content ? a.content.length : 0} 字符`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`完整内容:`);
    console.log(a.content || '（空）');
  });
  
  console.log('\n\n分类信息:');
  const categories = db.prepare('SELECT * FROM categories').all();
  categories.forEach(c => {
    console.log(`  ${c.id}: ${c.name} (${c.slug})`);
  });
  
  db.close();
} catch (e) {
  console.error('错误:', e);
}
