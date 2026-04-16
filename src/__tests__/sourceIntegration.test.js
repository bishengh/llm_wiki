const fs = require('fs-extra');
const path = require('path');
const SourceIntegration = require('../source/integration');

// 测试目录
const testWikiPath = path.join(__dirname, 'test-wiki');
const testUploadPath = path.join(__dirname, 'test-uploads');

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
    if (await fs.exists(testUploadPath)) {
      await fs.remove(testUploadPath);
    }
  } catch (error) {
    console.log('清理测试目录失败:', error.message);
  }
}

// 创建测试文件
async function createTestFile() {
  if (!await fs.exists(testUploadPath)) {
    await fs.mkdir(testUploadPath, { recursive: true });
  }

  const testFile = path.join(testUploadPath, 'test.txt');
  await fs.writeFile(testFile, 'This is a test file for LLM persistent wiki.');
  return testFile;
}

// 测试套件
describe('SourceIntegration', () => {
  let sourceIntegration;

  // 每个测试前清理并初始化
  beforeEach(async () => {
    await cleanupTestDir();
    sourceIntegration = new SourceIntegration(testConfig);
  });

  // 每个测试后清理
  afterEach(async () => {
    await cleanupTestDir();
  });

  // 测试获取支持的文件格式
  test('should get supported formats', () => {
    const formats = sourceIntegration.getSupportedFormats();
    expect(formats).toEqual(['pdf', 'docx', 'txt', 'md']);
  });

  // 测试创建处理管道
  test('should create processing pipeline', async () => {
    const result = await sourceIntegration.createProcessingPipeline();
    expect(result.success).toBe(true);
    expect(result.message).toBe('处理管道创建成功');
    expect(result.pipeline.steps).toEqual([
      '文件上传',
      '内容提取',
      '信息提取',
      '知识集成',
      '链接管理',
      '质量验证'
    ]);
  });

  // 测试提取文本文件内容
  test('should extract text file content', async () => {
    const testFile = await createTestFile();
    const content = await sourceIntegration.extractContent(testFile, 'test.txt');
    expect(content).toBe('This is a test file for LLM persistent wiki.');
  });

  // 测试提取PDF文件内容（占位实现）
  test('should extract PDF file content', async () => {
    const testFile = await createTestFile();
    const content = await sourceIntegration.extractContent(testFile, 'test.pdf');
    expect(content).toContain('[PDF内容]');
  });

  // 测试提取DOCX文件内容（占位实现）
  test('should extract DOCX file content', async () => {
    const testFile = await createTestFile();
    const content = await sourceIntegration.extractContent(testFile, 'test.docx');
    expect(content).toContain('[DOCX内容]');
  });

  // 测试提取信息（占位实现）
  test('should extract information', async () => {
    const content = 'This is a test content about LLM persistent wiki.';
    const info = await sourceIntegration.extractInformation(content);
    expect(info).toEqual({
      entities: [],
      topics: [],
      relationships: [],
      keyPoints: []
    });
  });
});
