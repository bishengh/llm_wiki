const fs = require('fs-extra');
const path = require('path');

class WikiCreation {
  constructor(config) {
    this.config = config;
    this.wikiPath = config.wikiPath;
  }

  // 初始化wiki
  async initWiki() {
    try {
      // 创建wiki主目录
      if (!await fs.exists(this.wikiPath)) {
        await fs.mkdir(this.wikiPath, { recursive: true });
        console.log(`创建wiki目录: ${this.wikiPath}`);
      }

      // 创建默认目录结构
      await this.createDefaultStructure();

      // 创建默认首页
      await this.createHomePage();

      // 创建配置文件
      await this.createWikiConfig();

      return { success: true, message: 'Wiki 初始化成功' };
    } catch (error) {
      console.error('Wiki 初始化失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 创建默认目录结构
  async createDefaultStructure() {
    const defaultDirs = [
      'entities',      // 实体页面
      'topics',        // 主题页面
      'attachments',   // 附件
      'history',       // 历史记录
      'templates'      // 模板
    ];

    for (const dir of defaultDirs) {
      const dirPath = path.join(this.wikiPath, dir);
      if (!await fs.exists(dirPath)) {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`创建目录: ${dirPath}`);
      }
    }
  }

  // 创建默认首页
  async createHomePage() {
    const homePage = path.join(this.wikiPath, 'home.md');
    if (!await fs.exists(homePage)) {
      const content = `# LLM 持久化 Wiki

欢迎使用 LLM 持久化 Wiki 系统。

## 功能

- 持久化知识存储
- 增量知识集成
- 智能链接管理
- 冲突解决
- 自然语言交互

## 使用指南

1. **添加文档源**：上传或指定文档源
2. **知识集成**：系统自动提取信息并集成到 wiki 中
3. **交互查询**：使用自然语言与 wiki 交互，获取信息
4. **维护更新**：定期更新和验证 wiki 内容

## 最近更新

<!-- 系统自动更新 -->
`;
      await fs.writeFile(homePage, content);
      console.log(`创建首页: ${homePage}`);
    }
  }

  // 创建wiki配置文件
  async createWikiConfig() {
    const configFile = path.join(this.wikiPath, 'wiki.config.json');
    if (!await fs.exists(configFile)) {
      const config = {
        name: 'LLM 持久化 Wiki',
        description: '使用 LLM 构建的持久化知识管理系统',
        version: '0.1.0',
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        defaultLanguage: 'zh-CN',
        structure: {
          entities: '实体页面',
          topics: '主题页面',
          attachments: '附件',
          history: '历史记录',
          templates: '模板'
        }
      };
      await fs.writeJSON(configFile, config, { spaces: 2 });
      console.log(`创建配置文件: ${configFile}`);
    }
  }

  // 创建默认模板
  async createDefaultTemplates() {
    const templatesDir = path.join(this.wikiPath, 'templates');
    
    // 实体模板
    const entityTemplate = path.join(templatesDir, 'entity.md');
    if (!await fs.exists(entityTemplate)) {
      const content = `# {{name}}

## 基本信息

- **类型**: 实体
- **创建时间**: {{created}}
- **最后更新**: {{updated}}

## 描述

{{description}}

## 相关实体

{{relatedEntities}}

## 来源

{{sources}}
`;
      await fs.writeFile(entityTemplate, content);
      console.log(`创建实体模板: ${entityTemplate}`);
    }

    // 主题模板
    const topicTemplate = path.join(templatesDir, 'topic.md');
    if (!await fs.exists(topicTemplate)) {
      const content = `# {{name}}

## 基本信息

- **类型**: 主题
- **创建时间**: {{created}}
- **最后更新**: {{updated}}

## 概述

{{overview}}

## 详细内容

{{content}}

## 相关主题

{{relatedTopics}}

## 相关实体

{{relatedEntities}}

## 来源

{{sources}}
`;
      await fs.writeFile(topicTemplate, content);
      console.log(`创建主题模板: ${topicTemplate}`);
    }
  }

  // 配置管理
  async updateConfig(newConfig) {
    try {
      const configFile = path.join(this.wikiPath, 'wiki.config.json');
      let currentConfig = {};

      if (await fs.exists(configFile)) {
        currentConfig = await fs.readJSON(configFile);
      }

      // 更新配置
      const updatedConfig = {
        ...currentConfig,
        ...newConfig,
        lastUpdated: new Date().toISOString()
      };

      await fs.writeJSON(configFile, updatedConfig, { spaces: 2 });
      return { success: true, message: '配置更新成功' };
    } catch (error) {
      console.error('配置更新失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 获取配置
  async getConfig() {
    try {
      const configFile = path.join(this.wikiPath, 'wiki.config.json');
      if (await fs.exists(configFile)) {
        return await fs.readJSON(configFile);
      }
      return null;
    } catch (error) {
      console.error('获取配置失败:', error);
      return null;
    }
  }
}

module.exports = WikiCreation;
