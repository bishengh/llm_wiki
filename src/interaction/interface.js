const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');

class WikiInteraction {
  constructor(config) {
    this.config = config;
    this.wikiPath = config.wikiPath;
  }

  // 处理自然语言查询
  async processQuery(query) {
    try {
      // 实际项目中可以使用LLM处理查询
      // 这里为了演示，返回占位响应
      const response = {
        query: query,
        answer: `这是对查询 "${query}" 的响应`,
        sources: [],
        confidence: 0.8
      };

      // 查找相关文档
      const relatedDocs = await this.findRelatedDocuments(query);
      response.sources = relatedDocs;

      return {
        success: true,
        message: '查询处理成功',
        data: response
      };
    } catch (error) {
      console.error('查询处理失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 查找相关文档
  async findRelatedDocuments(query) {
    try {
      // 实际项目中可以实现更复杂的文档检索逻辑
      // 这里为了演示，返回占位文档
      return [
        {
          title: 'LLM 持久化 Wiki',
          path: path.join(this.wikiPath, 'home.md'),
          score: 0.9
        }
      ];
    } catch (error) {
      console.error('查找相关文档失败:', error);
      return [];
    }
  }

  // 获取wiki页面
  async getPage(pagePath) {
    try {
      const fullPath = path.join(this.wikiPath, pagePath);
      if (await fs.exists(fullPath)) {
        const content = await fs.readFile(fullPath, 'utf8');
        const html = marked.parse(content);
        
        return {
          success: true,
          message: '页面获取成功',
          data: {
            content: content,
            html: html,
            path: fullPath
          }
        };
      } else {
        return { success: false, message: '页面不存在' };
      }
    } catch (error) {
      console.error('获取页面失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 更新wiki页面
  async updatePage(pagePath, content) {
    try {
      const fullPath = path.join(this.wikiPath, pagePath);
      await fs.writeFile(fullPath, content);
      
      return {
        success: true,
        message: '页面更新成功',
        data: {
          path: fullPath
        }
      };
    } catch (error) {
      console.error('更新页面失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 列出wiki页面
  async listPages() {
    try {
      const pages = [];
      
      // 列出实体页面
      const entitiesPath = path.join(this.wikiPath, 'entities');
      if (await fs.exists(entitiesPath)) {
        const entityFiles = await fs.readdir(entitiesPath);
        for (const file of entityFiles) {
          if (file.endsWith('.md')) {
            pages.push({
              title: path.basename(file, '.md'),
              path: path.join('entities', file),
              type: 'entity'
            });
          }
        }
      }
      
      // 列出主题页面
      const topicsPath = path.join(this.wikiPath, 'topics');
      if (await fs.exists(topicsPath)) {
        const topicFiles = await fs.readdir(topicsPath);
        for (const file of topicFiles) {
          if (file.endsWith('.md')) {
            pages.push({
              title: path.basename(file, '.md'),
              path: path.join('topics', file),
              type: 'topic'
            });
          }
        }
      }
      
      // 添加首页
      pages.push({
        title: '首页',
        path: 'home.md',
        type: 'home'
      });
      
      return {
        success: true,
        message: '页面列表获取成功',
        data: pages
      };
    } catch (error) {
      console.error('列出页面失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 收集用户反馈
  async collectFeedback(feedback) {
    try {
      const feedbackFile = path.join(this.wikiPath, 'feedback.json');
      let feedbacks = [];
      
      if (await fs.exists(feedbackFile)) {
        feedbacks = await fs.readJSON(feedbackFile);
      }
      
      feedbacks.push({
        ...feedback,
        timestamp: new Date().toISOString()
      });
      
      await fs.writeJSON(feedbackFile, feedbacks, { spaces: 2 });
      
      return {
        success: true,
        message: '反馈收集成功'
      };
    } catch (error) {
      console.error('收集反馈失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 搜索wiki
  async search(query) {
    try {
      // 实际项目中可以实现更复杂的搜索逻辑
      // 这里为了演示，返回占位结果
      return {
        success: true,
        message: '搜索成功',
        data: {
          query: query,
          results: [
            {
              title: 'LLM 持久化 Wiki',
              path: 'home.md',
              score: 0.9
            }
          ]
        }
      };
    } catch (error) {
      console.error('搜索失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 获取页面版本历史
  async getPageHistory(pagePath) {
    try {
      const historyPath = path.join(this.wikiPath, 'history');
      const pages = [];
      
      if (await fs.exists(historyPath)) {
        const historyFiles = await fs.readdir(historyPath);
        const pageBaseName = path.basename(pagePath, '.md');
        
        for (const file of historyFiles) {
          if (file.startsWith(pageBaseName) && file.endsWith('.md')) {
            const fullPath = path.join(historyPath, file);
            const content = await fs.readFile(fullPath, 'utf8');
            
            pages.push({
              fileName: file,
              path: fullPath,
              content: content
            });
          }
        }
      }
      
      return {
        success: true,
        message: '历史记录获取成功',
        data: pages
      };
    } catch (error) {
      console.error('获取历史记录失败:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = WikiInteraction;
