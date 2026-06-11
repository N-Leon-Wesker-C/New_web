import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'site.db');

console.log('更新数据库分类...');

try {
  const db = new Database(dbPath);
  
  // 清空现有分类
  db.prepare('DELETE FROM categories').run();
  
  // 正确的分类 - 和首页完全匹配
  const categories = [
    { slug: 'career/papers', name: '出版物', description: '传播文化知识的媒体' },
    { slug: 'career/projects', name: '项目', description: '做的一些工作' },
    { slug: 'career/technology', name: '经历', description: '学习和工作经历' },
    { slug: 'career/investment', name: '荣誉', description: '一些title' },
    { slug: 'blog/art', name: '艺术', description: '美在生活中消亡，在艺术中不朽' },
    { slug: 'blog/thoughts', name: '故事', description: '言者心之声，书者心之画' },
    { slug: 'blog/essay', name: '随笔', description: '写下一点东西' },
    { slug: 'blog/tech', name: '技术', description: '写一点技术博客' },
    { slug: 'blog/travel', name: '旅行', description: '读万卷书，行万里路' },
  ];
  
  // 插入新分类
  const insertCategory = db.prepare(
    'INSERT INTO categories (slug, name, description) VALUES (?, ?, ?)'
  );
  
  categories.forEach(c => {
    insertCategory.run(c.slug, c.name, c.description);
    console.log(`✓ ${c.name} (${c.slug})`);
  });
  
  console.log('\n✓ 分类更新完成!');
  
  // 验证
  const allCategories = db.prepare('SELECT * FROM categories').all();
  console.log('\n当前数据库中的分类:');
  allCategories.forEach(c => console.log(`  ${c.id}: ${c.name} (${c.slug})`));
  
  db.close();
} catch (e) {
  console.error('错误:', e);
}
