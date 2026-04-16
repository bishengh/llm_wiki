const fs = require('fs-extra');
const path = require('path');
const KnowledgeIntegration = require('../knowledge/integration');

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
describe('KnowledgeIntegration', () => {
  let knowledgeIntegration;

  // 每个测试前清理并初始化
  beforeEach(async () => {
    await cleanupTestDir();
    knowledgeIntegration = new KnowledgeIntegration(testConfig);
    // 确保目录存在
    await knowledgeIntegration.ensureDirectories();
  });

  // 每个测试后清理
  afterEach(async () => {
    await cleanupTestDir();
  });

  // 测试slugify方法
  test('should slugify text correctly', () => {
    const testText = 'LLM Persistent Wiki';
    const slug = knowledgeIntegration.slugify(testText);
    expect(slug).toBe('llm-persistent-wiki');
  });

  // 测试内容验证
  test('should validate content', async () => {
    const validContent = '# Test Content\n\nThis is valid content.';
    const invalidContent = 'Short';

    const validResult = await knowledgeIntegration.validateContent(validContent, 'entity');
    expect(validResult.isValid).toBe(true);
    expect(validResult.issues).toEqual([]);

    const invalidResult = await knowledgeIntegration.validateContent(invalidContent, 'entity');
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.issues).toContain('内容长度过短');
  });

  // 测试冲突解决
  test('should resolve conflict', async () => {
    const existingContent = '# Existing Content\n\nThis is existing content.';
    const newContent = '# New Content\n\nThis is new content.';

    const resolvedContent = await knowledgeIntegration.resolveConflict('test.md', newContent, existingContent);
    expect(resolvedContent).toContain('Existing Content');
    expect(resolvedContent).toContain('New Content');
  });

  // 测试链接管理
  test('should manage links', async () => {
    const result = await knowledgeIntegration.manageLinks();
    expect(result.success).toBe(true);
  });

  // 测试集成信息
  test('should integrate information', async () => {
    const extractedInfo = {
      entities: [
        {
          name: 'Test Entity',
          description: 'This is a test entity',
          relatedEntities: []
        }
      ],
      topics: [
        {
          name: 'Test Topic',
          overview: 'This is a test topic',
          content: 'Test topic content',
          relatedTopics: [],
          relatedEntities: []
        }
      ],
      relationships: []
    };

    const source = {
      fileName: 'test.txt',
      uploadedAt: new Date().toISOString()
    };

    const result = await knowledgeIntegration.integrateInformation(extractedInfo, source);
    expect(result.success).toBe(true);
    expect(result.message).toBe('信息集成成功');
    expect(result.data.entities.length).toBe(1);
    expect(result.data.topics.length).toBe(1);

    // 检查文件是否创建
    const entityFile = path.join(testWikiPath, 'entities', 'test-entity.md');
    const topicFile = path.join(testWikiPath, 'topics', 'test-topic.md');
    expect(await fs.exists(entityFile)).toBe(true);
    expect(await fs.exists(topicFile)).toBe(true);
  });
});
