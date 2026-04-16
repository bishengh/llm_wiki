const fs = require('fs-extra');
const path = require('path');
const WikiCreation = require('../wiki/creation');

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

// 测试套件
describe('WikiCreation', () => {
  let wikiCreation;

  // 每个测试前清理并初始化
  beforeEach(async () => {
    await cleanupTestDir();
    wikiCreation = new WikiCreation(testConfig);
  });

  // 每个测试后清理
  afterEach(async () => {
    await cleanupTestDir();
  });

  // 测试wiki初始化
  test('should initialize wiki successfully', async () => {
    const result = await wikiCreation.initWiki();
    expect(result.success).toBe(true);
    expect(result.message).toBe('Wiki 初始化成功');

    // 检查目录结构
    expect(await fs.exists(testWikiPath)).toBe(true);
    expect(await fs.exists(path.join(testWikiPath, 'entities'))).toBe(true);
    expect(await fs.exists(path.join(testWikiPath, 'topics'))).toBe(true);
    expect(await fs.exists(path.join(testWikiPath, 'attachments'))).toBe(true);
    expect(await fs.exists(path.join(testWikiPath, 'history'))).toBe(true);
    expect(await fs.exists(path.join(testWikiPath, 'templates'))).toBe(true);

    // 检查首页
    expect(await fs.exists(path.join(testWikiPath, 'home.md'))).toBe(true);

    // 检查配置文件
    expect(await fs.exists(path.join(testWikiPath, 'wiki.config.json'))).toBe(true);
  });

  // 测试获取配置
  test('should get wiki config', async () => {
    // 先初始化wiki
    await wikiCreation.initWiki();

    // 获取配置
    const config = await wikiCreation.getConfig();
    expect(config).toBeDefined();
    expect(config.name).toBe('LLM 持久化 Wiki');
    expect(config.version).toBe('0.1.0');
  });

  // 测试更新配置
  test('should update wiki config', async () => {
    // 先初始化wiki
    await wikiCreation.initWiki();

    // 更新配置
    const newConfig = {
      name: 'Test Wiki',
      description: 'A test wiki'
    };

    const result = await wikiCreation.updateConfig(newConfig);
    expect(result.success).toBe(true);
    expect(result.message).toBe('配置更新成功');

    // 验证配置已更新
    const config = await wikiCreation.getConfig();
    expect(config.name).toBe('Test Wiki');
    expect(config.description).toBe('A test wiki');
  });

  // 测试创建默认模板
  test('should create default templates', async () => {
    // 先初始化wiki
    await wikiCreation.initWiki();

    // 手动调用创建模板方法
    await wikiCreation.createDefaultTemplates();

    // 检查模板文件
    expect(await fs.exists(path.join(testWikiPath, 'templates', 'entity.md'))).toBe(true);
    expect(await fs.exists(path.join(testWikiPath, 'templates', 'topic.md'))).toBe(true);
  });

  // 测试重复初始化
  test('should handle repeated initialization', async () => {
    // 第一次初始化
    const result1 = await wikiCreation.initWiki();
    expect(result1.success).toBe(true);

    // 第二次初始化（应该不会报错）
    const result2 = await wikiCreation.initWiki();
    expect(result2.success).toBe(true);
  });
});
