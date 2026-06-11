import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'site.db');

console.log('重置管理员密码...');

try {
  const db = new Database(dbPath);
  
  // 删除现有管理员
  db.prepare('DELETE FROM admin WHERE username = ?').run('niechang');
  
  // 创建新密码哈希
  const password = 'Gbd@1722';
  const passwordHash = bcrypt.hashSync(password, 10);
  
  // 插入新管理员
  db.prepare('INSERT INTO admin (username, password_hash) VALUES (?, ?)').run('niechang', passwordHash);
  
  console.log('✓ 管理员重置成功!');
  console.log('  用户名: niechang');
  console.log('  密码: Gbd@1722');
  
  // 验证一下
  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get('niechang');
  console.log('\n验证:');
  console.log('  哈希密码长度:', admin.password_hash.length);
  console.log('  密码匹配:', bcrypt.compareSync(password, admin.password_hash));
  
  db.close();
} catch (e) {
  console.error('错误:', e);
}
