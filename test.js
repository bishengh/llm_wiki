const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 测试配置
const baseURL = 'http://localhost:3000';
const testFile = path.join(__dirname, 'test.txt');

// 创建测试文件
function createTestFile() {
  fs.writeFileSync(testFile, 'This is a test file for LLM persistent wiki.');
  console.log('Created test file:', testFile);
}

// 测试wiki初始化
async function testWikiInit() {
  console.log('\n=== Testing Wiki Initialization ===');
  try {
    const response = await axios.post(`${baseURL}/api/wiki/init`);
    console.log('Wiki init response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Error initializing wiki:', error.message);
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
    console.error('Error uploading file:', error.message);
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
    console.error('Error getting pages list:', error.message);
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
    console.error('Error processing query:', error.message);
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
    console.error('Error running maintenance:', error.message);
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
    console.error('Error creating backup:', error.message);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('Starting LLM Persistent Wiki Tests...');
  
  // 创建测试文件
  createTestFile();
  
  // 运行测试
  const tests = [
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
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
    console.log('\nCleaned up test file:', testFile);
  }
  
  // 输出测试结果
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log('\n❌ Some tests failed.');
  }
}

// 检查服务器是否运行
async function checkServer() {
  console.log('Checking if server is running...');
  try {
    const response = await axios.get(baseURL);
    console.log('Server is running:', response.status === 200);
    return response.status === 200;
  } catch (error) {
    console.error('Server is not running:', error.message);
    return false;
  }
}

// 主函数
async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('Please start the server first with: npm start');
    return;
  }
  
  await runAllTests();
}

main();
