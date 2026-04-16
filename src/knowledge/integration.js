const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class KnowledgeIntegration {
  constructor(config) {
    this.config = config;
    this.wikiPath = config.wikiPath;
    this.entitiesPath = path.join(config.wikiPath, 'entities');
    this.topicsPath = path.join(config.wikiPath, 'topics');
    this.historyPath = path.join(config.wikiPath, 'history');
  }

  // 集成信息到wiki
  async integrateInformation(extractedInfo, source) {
    try {
      // 确保目录存在
      await this.ensureDirectories();

      const results = {
        entities: [],
        topics: [],
        updates: []
      };

      // 处理实体
      if (extractedInfo.entities && extractedInfo.entities.length > 0) {
        for (const entity of extractedInfo.entities) {
          const result = await this.integrateEntity(entity, source);
          results.entities.push(result);
        }
      }

      // 处理主题
      if (extractedInfo.topics && extractedInfo.topics.length > 0) {
        for (const topic of extractedInfo.topics) {
          const result = await this.integrateTopic(topic, source);
          results.topics.push(result);
        }
      }

      // 处理关系
      if (extractedInfo.relationships && extractedInfo.relationships.length > 0) {
        await this.integrateRelationships(extractedInfo.relationships);
      }

      // 更新首页
      await this.updateHomePage();

      return {
        success: true,
        message: '信息集成成功',
        data: results
      };
    } catch (error) {
      console.error('信息集成失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 确保目录存在
  async ensureDirectories() {
    const directories = [this.entitiesPath, this.topicsPath, this.historyPath];
    for (const dir of directories) {
      if (!await fs.exists(dir)) {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  // 集成实体
  async integrateEntity(entity, source) {
    try {
      const entityId = this.slugify(entity.name);
      const entityFile = path.join(this.entitiesPath, `${entityId}.md`);
      
      let existingContent = '';
      let isNew = false;
      
      if (await fs.exists(entityFile)) {
        existingContent = await fs.readFile(entityFile, 'utf8');
      } else {
        isNew = true;
      }

      // 生成实体内容
      const content = this.generateEntityContent(entity, source, existingContent);

      // 保存历史记录
      await this.saveHistory(entityFile, existingContent);

      // 写入文件
      await fs.writeFile(entityFile, content);

      return {
        id: entityId,
        name: entity.name,
        isNew: isNew,
        path: entityFile
      };
    } catch (error) {
      console.error('实体集成失败:', error);
      return null;
    }
  }

  // 集成主题
  async integrateTopic(topic, source) {
    try {
      const topicId = this.slugify(topic.name);
      const topicFile = path.join(this.topicsPath, `${topicId}.md`);
      
      let existingContent = '';
      let isNew = false;
      
      if (await fs.exists(topicFile)) {
        existingContent = await fs.readFile(topicFile, 'utf8');
      } else {
        isNew = true;
      }

      // 生成主题内容
      const content = this.generateTopicContent(topic, source, existingContent);

      // 保存历史记录
      await this.saveHistory(topicFile, existingContent);

      // 写入文件
      await fs.writeFile(topicFile, content);

      return {
        id: topicId,
        name: topic.name,
        isNew: isNew,
        path: topicFile
      };
    } catch (error) {
      console.error('主题集成失败:', error);
      return null;
    }
  }

  // 集成关系
  async integrateRelationships(relationships) {
    try {
      // 实际项目中可以实现更复杂的关系管理
      // 这里为了演示，只是记录关系
      console.log('集成关系:', relationships);
      return { success: true };
    } catch (error) {
      console.error('关系集成失败:', error);
      return { success: false };
    }
  }

  // 生成实体内容
  generateEntityContent(entity, source, existingContent) {
    const now = new Date().toISOString();
    const created = existingContent ? '<!-- 已存在 -->' : now;

    return `# ${entity.name}

## 基本信息

- **类型**: 实体
- **创建时间**: ${created}
- **最后更新**: ${now}

## 描述

${entity.description || '暂无描述'}

## 相关实体

${entity.relatedEntities ? entity.relatedEntities.map(e => `- [[${e}]]`).join('\n') : '暂无相关实体'}

## 来源

- **文件**: ${source.fileName}
- **上传时间**: ${source.uploadedAt}
`;
  }

  // 生成主题内容
  generateTopicContent(topic, source, existingContent) {
    const now = new Date().toISOString();
    const created = existingContent ? '<!-- 已存在 -->' : now;

    return `# ${topic.name}

## 基本信息

- **类型**: 主题
- **创建时间**: ${created}
- **最后更新**: ${now}

## 概述

${topic.overview || '暂无概述'}

## 详细内容

${topic.content || '暂无详细内容'}

## 相关主题

${topic.relatedTopics ? topic.relatedTopics.map(t => `- [[${t}]]`).join('\n') : '暂无相关主题'}

## 相关实体

${topic.relatedEntities ? topic.relatedEntities.map(e => `- [[${e}]]`).join('\n') : '暂无相关实体'}

## 来源

- **文件**: ${source.fileName}
- **上传时间**: ${source.uploadedAt}
`;
  }

  // 保存历史记录
  async saveHistory(filePath, content) {
    try {
      if (!content) return;

      const relativePath = path.relative(this.wikiPath, filePath);
      const historyFile = path.join(this.historyPath, `${path.basename(filePath, '.md')}_${Date.now()}.md`);
      
      await fs.writeFile(historyFile, content);
      console.log(`保存历史记录: ${historyFile}`);
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }

  // 更新首页
  async updateHomePage() {
    try {
      const homePage = path.join(this.wikiPath, 'home.md');
      if (await fs.exists(homePage)) {
        const content = await fs.readFile(homePage, 'utf8');
        const updatedContent = content.replace(
          /## 最近更新\n\n<!-- 系统自动更新 -->/, 
          `## 最近更新\n\n- **更新时间**: ${new Date().toISOString()}\n<!-- 系统自动更新 -->`
        );
        await fs.writeFile(homePage, updatedContent);
      }
    } catch (error) {
      console.error('更新首页失败:', error);
    }
  }

  // 生成slug
  slugify(text) {
    return text.toLowerCase()
      .replace(/[\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '');
  }

  // 解决冲突
  async resolveConflict(filePath, newContent, existingContent) {
    try {
      // 实际项目中可以实现更复杂的冲突解决逻辑
      // 这里为了演示，简单地保留现有内容并添加新内容
      const mergedContent = existingContent + '\n\n## 新增内容\n\n' + newContent;
      return mergedContent;
    } catch (error) {
      console.error('冲突解决失败:', error);
      return existingContent;
    }
  }

  // 质量控制验证
  async validateContent(content, type) {
    try {
      // 实际项目中可以实现更复杂的验证逻辑
      // 这里为了演示，简单地检查内容长度
      const validation = {
        isValid: content.length > 10,
        issues: []
      };

      if (content.length <= 10) {
        validation.issues.push('内容长度过短');
      }

      return validation;
    } catch (error) {
      console.error('内容验证失败:', error);
      return { isValid: false, issues: [error.message] };
    }
  }

  // 管理链接
  async manageLinks() {
    try {
      // 实际项目中可以实现更复杂的链接管理逻辑
      // 这里为了演示，只是记录链接管理操作
      console.log('管理链接');
      return { success: true };
    } catch (error) {
      console.error('链接管理失败:', error);
      return { success: false };
    }
  }
}

module.exports = KnowledgeIntegration;
