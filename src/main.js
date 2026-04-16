const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

// 导入模块
const WikiCreation = require('./wiki/creation');
const SourceIntegration = require('./source/integration');
const KnowledgeIntegration = require('./knowledge/integration');
const WikiInteraction = require('./interaction/interface');
const WikiMaintenance = require('./maintenance/system');

const app = express();
const port = 3000;

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// 配置目录
const configDir = path.join(__dirname, 'config');
const wikiDir = path.join(__dirname, 'wiki');
const uploadDir = path.join(__dirname, 'uploads');

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 初始化配置
async function initConfig() {
  if (!await fs.exists(configDir)) {
    await fs.mkdir(configDir, { recursive: true });
  }
  
  const configFile = path.join(configDir, 'config.json');
  if (!await fs.exists(configFile)) {
    const defaultConfig = {
      wikiPath: wikiDir,
      port: port,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      supportedFormats: ['pdf', 'docx', 'txt', 'md']
    };
    await fs.writeJSON(configFile, defaultConfig, { spaces: 2 });
  }
  
  return await fs.readJSON(configFile);
}

// 初始化模块
let wikiCreation, sourceIntegration, knowledgeIntegration, wikiInteraction, wikiMaintenance;

// 路由
app.get('/', (req, res) => {
  res.send('LLM 持久化 Wiki 系统');
});

// Wiki 初始化
app.post('/api/wiki/init', async (req, res) => {
  try {
    const result = await wikiCreation.initWiki();
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 上传文件
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await sourceIntegration.processFile(req.file);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 批量上传文件
app.post('/api/files/upload-batch', upload.array('files'), async (req, res) => {
  try {
    const result = await sourceIntegration.processBatch(req.files);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 集成信息
app.post('/api/knowledge/integrate', async (req, res) => {
  try {
    const { extractedInfo, source } = req.body;
    const result = await knowledgeIntegration.integrateInformation(extractedInfo, source);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 处理查询
app.post('/api/interaction/query', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await wikiInteraction.processQuery(query);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 获取页面
app.get('/api/pages/:path', async (req, res) => {
  try {
    const { path: pagePath } = req.params;
    const result = await wikiInteraction.getPage(pagePath);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 更新页面
app.put('/api/pages/:path', async (req, res) => {
  try {
    const { path: pagePath } = req.params;
    const { content } = req.body;
    const result = await wikiInteraction.updatePage(pagePath, content);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 列出页面
app.get('/api/pages', async (req, res) => {
  try {
    const result = await wikiInteraction.listPages();
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 搜索
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const result = await wikiInteraction.search(q);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 收集反馈
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = req.body;
    const result = await wikiInteraction.collectFeedback(feedback);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 运行维护
app.post('/api/maintenance/run', async (req, res) => {
  try {
    const result = await wikiMaintenance.runUpdate();
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 创建备份
app.post('/api/maintenance/backup', async (req, res) => {
  try {
    const result = await wikiMaintenance.createBackup();
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 列出备份
app.get('/api/maintenance/backups', async (req, res) => {
  try {
    const result = await wikiMaintenance.listBackups();
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 从备份恢复
app.post('/api/maintenance/restore', async (req, res) => {
  try {
    const { backupFile } = req.body;
    const result = await wikiMaintenance.restoreFromBackup(backupFile);
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 启动服务器
async function startServer() {
  const config = await initConfig();
  
  // 初始化模块
  wikiCreation = new WikiCreation(config);
  sourceIntegration = new SourceIntegration(config);
  knowledgeIntegration = new KnowledgeIntegration(config);
  wikiInteraction = new WikiInteraction(config);
  wikiMaintenance = new WikiMaintenance(config);
  
  // 初始化wiki
  await wikiCreation.initWiki();
  
  app.listen(port, () => {
    console.log(`LLM 持久化 Wiki 系统运行在 http://localhost:${port}`);
  });
}

startServer();
