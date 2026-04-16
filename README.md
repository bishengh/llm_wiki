# LLM 持久化 Wiki

## 项目简介

LLM 持久化 Wiki 是一个创新的知识管理系统，它利用大型语言模型 (LLM) 从文档中提取知识并构建一个结构化、可持续更新的 wiki。与传统的 RAG (检索增强生成) 系统不同，该系统会随着时间积累知识，而不是在每次查询时从头开始。

## 核心功能

- **持久化知识存储**：构建和维护结构化的 markdown 文件集合
- **增量知识集成**：当添加新源时，系统会读取内容并将其集成到现有 wiki 中
- **智能链接管理**：自动创建和维护相关页面之间的链接
- **冲突解决**：检测并解决信息冲突，确保知识的一致性
- **用户友好界面**：基于聊天的交互界面，支持自然语言查询
- **内容验证**：定期验证 wiki 内容的准确性和一致性
- **备份和恢复**：自动创建备份，支持从备份恢复
- **API接口**：完整的 RESTful API，支持系统的所有功能
- **单元测试**：使用 Jest 进行全面的单元测试

## 项目结构

```
llm_wiki/
├── .gitignore
├── README.md
├── LICENSE
├── integration.test.js    # 集成测试脚本
├── test.js                # 功能测试脚本
├── public/                # 前端文件
│   └── index.html         # 前端页面
├── openspec/            # OpenSpec规范文件
│   ├── config.yaml
│   └── changes/
│       └── llm-persistent-wiki/
│           ├── .openspec.yaml
│           ├── design.md        # 技术设计文档
│           ├── proposal.md      # 功能提案
│           ├── tasks.md         # 实施任务列表
│           └── specs/           # 详细规范
│               ├── knowledge-integration/  # 知识集成规范
│               ├── source-integration/     # 源集成规范
│               ├── wiki-creation/          # Wiki创建规范
│               ├── wiki-interaction/       # Wiki交互规范
│               └── wiki-maintenance/       # Wiki维护规范
└── src/                 # 源代码
    ├── __tests__/         # 单元测试
    ├── config/          # 配置文件
    ├── interaction/     # 交互模块
    ├── knowledge/       # 知识集成模块
    ├── maintenance/     # 维护模块
    ├── source/          # 源集成模块
    ├── wiki/            # wiki存储
    ├── main.js          # 主服务器文件
    ├── package.json     # 项目配置
    └── uploads/         # 上传文件临时存储
```

## 技术栈

- **后端**：Node.js, Express, Multer, Marked, fs-extra, uuid
- **前端**：HTML, CSS, JavaScript
- **存储**：文件系统存储 (markdown 文件)
- **处理**：大型语言模型 (LLM)
- **集成**：支持多种文件格式 (PDF, DOCX, TXT, markdown)
- **测试**：Jest 单元测试框架, Axios (API测试)

## 快速开始

1. **克隆仓库**：`git clone https://github.com/bishengh/llm_wiki.git`
2. **安装依赖**：在 `src` 目录中运行 `npm install`
3. **启动服务器**：在 `src` 目录中运行 `npm start`
4. **访问系统**：打开浏览器访问 `http://localhost:3000`

## 如何使用

1. **上传文件**：使用"上传文件"功能上传文档
2. **浏览页面**：使用"查看页面"功能浏览wiki内容
3. **查询交互**：使用"查询交互"功能进行自然语言查询
4. **系统维护**：使用"系统维护"功能进行备份和维护

## API接口

- **POST /api/wiki/init** - Wiki初始化
- **POST /api/files/upload** - 文件上传
- **POST /api/files/upload-batch** - 批量文件上传
- **POST /api/knowledge/integrate** - 信息集成
- **POST /api/interaction/query** - 自然语言查询
- **GET /api/pages** - 列出页面
- **GET /api/pages/:path** - 获取页面内容
- **PUT /api/pages/:path** - 更新页面内容
- **GET /api/search** - 搜索功能
- **POST /api/feedback** - 反馈收集
- **POST /api/maintenance/run** - 运行维护
- **POST /api/maintenance/backup** - 创建备份
- **GET /api/maintenance/backups** - 列出备份
- **POST /api/maintenance/restore** - 从备份恢复

## 开发指南

项目使用 OpenSpec 规范驱动开发流程。主要开发步骤包括：

1. **提案**：定义功能和目标
2. **设计**：制定技术架构和实现方案
3. **规范**：详细定义各模块的要求
4. **任务**：分解实施步骤
5. **实施**：按照任务列表进行开发
6. **测试**：验证功能和性能

## 测试

### 单元测试
- 运行命令：`cd src && npm test`
- 测试覆盖所有核心模块
- 使用 Jest 测试框架

### 集成测试
- 运行命令：`node integration.test.js`
- 测试完整的系统功能
- 验证 API 接口和系统集成

## 实施状态

✅ **已完成**：
- Wiki创建模块
- 源集成模块
- 知识集成模块
- Wiki交互模块
- Wiki维护模块
- 前端界面
- API接口
- 服务器配置
- 单元测试 (Jest)
- 集成测试
- 文档更新

## 版本信息

- **V0.1**：初始版本，包含核心功能实现
- **V0.2**：完整版本，添加单元测试、集成测试和bug修复
- **V0.3**：最终版本，添加完整的文档更新、集成测试和系统优化

## 系统架构

LLM 持久化 Wiki 系统采用模块化设计，包含以下核心模块：

1. **WikiCreation模块**：负责wiki的初始化和配置管理
2. **SourceIntegration模块**：处理文件上传和内容提取
3. **KnowledgeIntegration模块**：将提取的信息集成到wiki中
4. **WikiInteraction模块**：处理用户查询和页面管理
5. **WikiMaintenance模块**：负责系统维护和备份

系统通过 RESTful API 接口提供服务，前端通过这些接口与后端交互。

## 常见问题

### Q: 系统支持哪些文件格式？
A: 系统支持 PDF、DOCX、TXT 和 markdown 格式的文件。

### Q: 如何恢复从备份？
A: 使用系统维护功能中的"从备份恢复"选项，选择要恢复的备份文件。

### Q: 系统如何处理信息冲突？
A: 系统会检测信息冲突，并提供冲突解决机制，确保知识的一致性。

### Q: 如何扩展系统功能？
A: 系统采用模块化设计，可以通过添加新模块或扩展现有模块来添加新功能。

## 贡献

欢迎贡献代码、文档或提出建议。请遵循项目的开发流程和规范。

## 许可证

本项目采用 MIT 许可证。
