import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'site.db');

console.log('检查数据库:', dbPath);

try {
  const db = new Database(dbPath);
  
  console.log('\n=== 检查 categories 表 ===');
  const categories = db.prepare('SELECT * FROM categories').all();
  console.log('分类数量:', categories.length);
  categories.forEach(c => {
    console.log(`  ID: ${c.id}, Slug: ${c.slug}, Name: ${c.name}`);
  });
  
  console.log('\n=== 检查 articles 表 ===');
  const articles = db.prepare('SELECT * FROM articles').all();
  console.log('文章数量:', articles.length);
  articles.forEach(a => {
    console.log(`  ID: ${a.id}, Title: ${a.title}, Category: ${a.category_id}, Published: ${a.published}`);
  });
  
  console.log('\n=== 检查 users 表 ===');
  const users = db.prepare('SELECT * FROM users').all();
  console.log('用户数量:', users.length);
  users.forEach(u => {
    console.log(`  ID: ${u.id}, Username: ${u.username}, Email: ${u.email}`);
  });
  
  console.log('\n=== 检查 admin 表 ===');
  const admins = db.prepare('SELECT * FROM admin').all();
  console.log('管理员数量:', admins.length);
  admins.forEach(a => {
    console.log(`  ID: ${a.id}, Username: ${a.username}`);
  });
  
  db.close();
  console.log('\n数据库检查完成!');
} catch (e) {
  console.error('错误:', e);
}
