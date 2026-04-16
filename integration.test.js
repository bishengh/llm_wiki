const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 测试配置
const baseURL = 'http://localhost:3000';
const testFile = path.join(__dirname, 'test.txt');

// 创建测试文件
function createTestFile() {
  fs.writeFileSync(testFile, 'This is a test file for LLM persistent wiki integration test.');
  console.log('Created test file:', testFile);
}

// 清理测试文件
function cleanupTestFile() {
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
    console.log('Cleaned up test file:', testFile);
  }
}

// 测试服务器状态
async function testServerStatus() {
  console.log('\n=== Testing Server Status ===');
  try {
    const response = await axios.get(baseURL);
    console.log('Server status:', response.status);
    return response.status === 200;
  } catch (error) {
    console.error('Server error:', error.message);
    return false;
  }
}

// 测试Wiki初始化
async function testWikiInit() {
  console.log('\n=== Testing Wiki Initialization ===');
  try {
    const response = await axios.post(`${baseURL}/api/wiki/init`);
    console.log('Wiki init response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Wiki init error:', error.message);
    return false;
  }
}

// 测试文件上传
async function testFileUpload() {
  console.log('\n=== Testing File Upload ===');
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFile));
    
    const response = await axios.post(`${baseURL}/api/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('File upload response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('File upload error:', error.message);
    return false;
  }
}

// 测试页面列表
async function testPagesList() {
  console.log('\n=== Testing Pages List ===');
  try {
    const response = await axios.get(`${baseURL}/api/pages`);
    console.log('Pages list response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Pages list error:', error.message);
    return false;
  }
}

// 测试查询
async function testQuery() {
  console.log('\n=== Testing Query ===');
  try {
    const response = await axios.post(`${baseURL}/api/interaction/query`, {
      query: 'What is LLM persistent wiki?'
    });
    console.log('Query response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Query error:', error.message);
    return false;
  }
}

// 测试维护
async function testMaintenance() {
  console.log('\n=== Testing Maintenance ===');
  try {
    const response = await axios.post(`${baseURL}/api/maintenance/run`);
    console.log('Maintenance response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Maintenance error:', error.message);
    return false;
  }
}

// 测试备份
async function testBackup() {
  console.log('\n=== Testing Backup ===');
  try {
    const response = await axios.post(`${baseURL}/api/maintenance/backup`);
    console.log('Backup response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Backup error:', error.message);
    return false;
  }
}

// 运行所有集成测试
async function runIntegrationTests() {
  console.log('Starting LLM Persistent Wiki Integration Tests...');
  
  // 创建测试文件
  createTestFile();
  
  // 运行测试
  const tests = [
    testServerStatus,
    testWikiInit,
    testPagesList,
    testQuery,
    testMaintenance,
    testBackup
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  // 清理测试文件
  cleanupTestFile();
  
  // 输出测试结果
  console.log('\n=== Integration Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n✅ All integration tests passed!');
  } else {
    console.log('\n❌ Some integration tests failed.');
  }
}

// 主函数
async function main() {
  await runIntegrationTests();
}

main();
