const fs = require('fs-extra');
const path = require('path');
const WikiInteraction = require('../interaction/interface');

// 测试目录
const testWikiPath = path.join(__dirname, 'test-wiki');

// 测试配置
const testConfig = {
  wikiPath: testWikiPath,
  port: 3000,
  maxFileSize: 10 * 1024 * 1024,
  supportedFormats: ['pdf', 'docx', 'txt', 'md']
};

// 清理测试目录
async function cleanupTestDir() {
  try {
    if (await fs.exists(testWikiPath)) {
      await fs.remove(testWikiPath);
    }
  } catch (error) {
    console.log('清理测试目录失败:', error.message);
  }
}

// 创建测试页面
async function createTestPage() {
  if (!await fs.exists(testWikiPath)) {
    await fs.mkdir(testWikiPath, { recursive: true });
  }

  const testPage = path.join(testWikiPath, 'test.md');
  await fs.writeFile(testPage, '# Test Page\n\nThis is a test page.');
  return testPage;
}

// 测试套件
describe('WikiInteraction', () => {
  let wikiInteraction;

  // 每个测试前清理并初始化
  beforeEach(async () => {
    await cleanupTestDir();
    wikiInteraction = new WikiInteraction(testConfig);
  });

  // 每个测试后清理
  afterEach(async () => {
    await cleanupTestDir();
  });

  // 测试处理查询
  test('should process query', async () => {
    const query = 'What is LLM persistent wiki?';
    const result = await wikiInteraction.processQuery(query);
    expect(result.success).toBe(true);
    expect(result.message).toBe('查询处理成功');
    expect(result.data.query).toBe(query);
    expect(result.data.answer).toContain(query);
  });

  // 测试搜索
  test('should search wiki', async () => {
    const query = 'test';
    const result = await wikiInteraction.search(query);
    expect(result.success).toBe(true);
    expect(result.message).toBe('搜索成功');
    expect(result.data.query).toBe(query);
    expect(result.data.results.length).toBeGreaterThan(0);
  });

  // 测试获取页面
  test('should get page', async () => {
    await createTestPage();
    const result = await wikiInteraction.getPage('test.md');
    expect(result.success).toBe(true);
    expect(result.message).toBe('页面获取成功');
    expect(result.data.content).toContain('Test Page');
    expect(result.data.html).toContain('<h1>Test Page</h1>');
  });

  // 测试获取不存在的页面
  test('should handle non-existent page', async () => {
    const result = await wikiInteraction.getPage('non-existent.md');
    expect(result.success).toBe(false);
    expect(result.message).toBe('页面不存在');
  });

  // 测试更新页面
  test('should update page', async () => {
    await createTestPage();
    const newContent = '# Updated Test Page\n\nThis is an updated test page.';
    const result = await wikiInteraction.updatePage('test.md', newContent);
    expect(result.success).toBe(true);
    expect(result.message).toBe('页面更新成功');

    // 验证页面已更新
    const updatedResult = await wikiInteraction.getPage('test.md');
    expect(updatedResult.data.content).toBe(newContent);
  });

  // 测试列出页面
  test('should list pages', async () => {
    await createTestPage();
    const result = await wikiInteraction.listPages();
    expect(result.success).toBe(true);
    expect(result.message).toBe('页面列表获取成功');
    expect(result.data.length).toBeGreaterThan(0);
  });

  // 测试收集反馈
  test('should collect feedback', async () => {
    const feedback = {
      type: 'suggestion',
      content: 'This is a test feedback',
      rating: 5
    };
    const result = await wikiInteraction.collectFeedback(feedback);
    expect(result.success).toBe(true);
    expect(result.message).toBe('反馈收集成功');

    // 验证反馈文件已创建
    const feedbackFile = path.join(testWikiPath, 'feedback.json');
    expect(await fs.exists(feedbackFile)).toBe(true);
  });

  // 测试获取页面历史
  test('should get page history', async () => {
    await createTestPage();
    const result = await wikiInteraction.getPageHistory('test.md');
    expect(result.success).toBe(true);
    expect(result.message).toBe('历史记录获取成功');
  });
});
