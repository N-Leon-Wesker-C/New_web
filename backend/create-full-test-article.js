import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'site.db');

console.log('创建完整的测试文章...\n');

try {
  const db = new Database(dbPath);
  
  // 先清空旧文章
  db.prepare('DELETE FROM articles').run();
  
  // 创建完整的测试文章
  const content = `# 欢迎使用博客系统

这是一篇完整的测试文章，用于验证博客系统的功能。

## 功能介绍

我们的博客系统包含以下功能：

1. **用户注册和登录**
2. **管理员后台管理**
3. **Markdown 内容编辑器**
4. **评论系统**

### 代码示例

下面是一个简单的代码示例：

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
  return 'Welcome to my blog';
}
\`\`\`

## 技术栈

- **前端**: Vue 3 + Vite
- **后端**: Node.js + Express
- **数据库**: SQLite

> 这是一个引用块，用于展示引用内容。

## 总结

感谢使用我们的博客系统！希望你能喜欢。
`;

  const result = db.prepare(`
    INSERT INTO articles (category_id, title, slug, content, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    52, // 技术分类
    '完整的测试文章',
    'full-test-article',
    content,
    1
  );
  
  console.log('✅ 测试文章创建成功!');
  console.log('   文章ID:', result.lastInsertRowid);
  
  // 验证一下
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid);
  console.log('\n📝 文章详情:');
  console.log('   标题:', article.title);
  console.log('   分类:', article.category_id);
  console.log('   内容长度:', article.content.length);
  console.log('   完整内容:');
  console.log('───────────────────────────────');
  console.log(article.content);
  console.log('───────────────────────────────');
  
  db.close();
  console.log('\n🎉 完成！现在去前端看看吧！');
  
} catch (e) {
  console.error('❌ 错误:', e);
}
