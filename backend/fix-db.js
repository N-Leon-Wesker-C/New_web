import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'site.db');

console.log('修复数据库...');

try {
  const db = new Database(dbPath);
  
  // 检查 comments 表结构
  const columns = db.prepare("PRAGMA table_info(comments)").all();
  console.log('现有 comments 表字段:');
  columns.forEach(c => console.log(`  ${c.name}`));
  
  // 检查是否有 user_id 字段
  const hasUserId = columns.some(c => c.name === 'user_id');
  
  if (!hasUserId) {
    console.log('\n添加 user_id 字段...');
    db.prepare('ALTER TABLE comments ADD COLUMN user_id INTEGER').run();
    console.log('✓ user_id 字段添加成功!');
  } else {
    console.log('\n✓ user_id 字段已存在');
  }
  
  // 检查所有表
  console.log('\n所有表:');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  tables.forEach(t => console.log(`  ${t.name}`));
  
  db.close();
  console.log('\n数据库修复完成!');
} catch (e) {
  console.error('错误:', e);
}
