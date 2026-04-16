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

## 项目结构

```
llm_wiki/
├── .gitignore
├── README.md
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
    ├── config/          # 配置文件
    ├── interaction/     # 交互模块
    ├── knowledge/       # 知识集成模块
    ├── maintenance/     # 维护模块
    ├── source/          # 源集成模块
    ├── wiki/            # wiki存储
    ├── public/          # 前端文件
    ├── main.js          # 主服务器文件
    ├── package.json     # 项目配置
    └── uploads/         # 上传文件临时存储
```

## 技术栈

- **后端**：Node.js, Express, Multer, Marked, fs-extra
- **前端**：HTML, CSS, JavaScript
- **存储**：文件系统存储 (markdown 文件)
- **处理**：大型语言模型 (LLM)
- **集成**：支持多种文件格式 (PDF, DOCX, TXT, markdown)

## 如何使用

1. **启动服务器**：在 `src` 目录中运行 `npm start`
2. **访问系统**：打开浏览器访问 `http://localhost:3000`
3. **上传文件**：使用"上传文件"功能上传文档
4. **浏览页面**：使用"查看页面"功能浏览wiki内容
5. **查询交互**：使用"查询交互"功能进行自然语言查询
6. **系统维护**：使用"系统维护"功能进行备份和维护

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

## 贡献

欢迎贡献代码、文档或提出建议。请遵循项目的开发流程和规范。

## 许可证

本项目采用 MIT 许可证。
