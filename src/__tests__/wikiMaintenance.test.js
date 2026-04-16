const fs = require('fs-extra');
const path = require('path');
const WikiMaintenance = require('../maintenance/system');

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
describe('WikiMaintenance', () => {
  let wikiMaintenance;

  // 每个测试前清理并初始化
  beforeEach(async () => {
    await cleanupTestDir();
    wikiMaintenance = new WikiMaintenance(testConfig);
  });

  // 每个测试后清理
  afterEach(async () => {
    await cleanupTestDir();
  });

  // 测试验证页面内容
  test('should validate page content', async () => {
    const validContent = '# Test Page\n\n## 基本信息\n\n- **类型**: 实体\n\n## 描述\n\nThis is a valid test page.';
    const invalidContent = 'Short';

    const validResult = wikiMaintenance.validatePageContent(validContent, 'entity');
    expect(validResult.isValid).toBe(true);
    expect(validResult.issues).toEqual([]);

    const invalidResult = wikiMaintenance.validatePageContent(invalidContent, 'entity');
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.issues).toContain('内容长度过短');
  });

  // 测试清理临时文件
  test('should cleanup temp files', async () => {
    const result = await wikiMaintenance.cleanupTempFiles();
    expect(result.success).toBe(true);
  });

  // 测试优化文件结构
  test('should optimize file structure', async () => {
    const result = await wikiMaintenance.optimizeFileStructure();
    expect(result.success).toBe(true);
  });

  // 测试创建备份
  test('should create backup', async () => {
    await createTestPage();
    const result = await wikiMaintenance.createBackup();
    expect(result.success).toBe(true);
    expect(result.message).toBe('备份创建成功');
    expect(result.data.backupFile).toContain('backup_');
    expect(result.data.backupFile).toContain('.zip');

    // 验证备份文件已创建
    expect(await fs.exists(result.data.backupFile)).toBe(true);
  });

  // 测试列出备份
  test('should list backups', async () => {
    await createTestPage();
    // 创建一个备份
    await wikiMaintenance.createBackup();
    const result = await wikiMaintenance.listBackups();
    expect(result.success).toBe(true);
    expect(result.message).toBe('备份列表获取成功');
    expect(result.data.length).toBeGreaterThan(0);
  });

  // 测试从备份恢复
  test('should restore from backup', async () => {
    await createTestPage();
    // 创建一个备份
    const backupResult = await wikiMaintenance.createBackup();
    const backupFile = path.basename(backupResult.data.backupFile);
    
    const restoreResult = await wikiMaintenance.restoreFromBackup(backupFile);
    expect(restoreResult.success).toBe(true);
    expect(restoreResult.message).toBe('从备份恢复成功');
  });

  // 测试清理旧备份
  test('should cleanup old backups', async () => {
    await createTestPage();
    // 创建一个备份
    await wikiMaintenance.createBackup();
    
    const result = await wikiMaintenance.cleanupOldBackups(0); // 清理所有备份
    expect(result.success).toBe(true);
  });

  // 测试运行维护
  test('should run maintenance', async () => {
    await createTestPage();
    const result = await wikiMaintenance.runUpdate();
    expect(result.success).toBe(true);
    expect(result.message).toBe('Wiki 更新成功');
    expect(result.data.actions).toEqual(['内容验证', '性能优化', '备份创建']);
  });
});
