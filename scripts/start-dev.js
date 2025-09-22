#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Tripmate 개발 환경 시작...\n');

// 백엔드 서버 시작
console.log('📡 백엔드 서버 시작 중...');
const backendProcess = exec('npm run dev', { 
  cwd: path.join(__dirname, '../server'),
  stdio: 'inherit'
});

backendProcess.on('error', (error) => {
  console.error('백엔드 서버 시작 실패:', error);
});

backendProcess.on('exit', (code) => {
  console.log(`백엔드 서버 종료 (코드: ${code})`);
});

// 3초 후 프론트엔드 시작
setTimeout(() => {
  console.log('\n📱 프론트엔드 앱 시작 중...');
  const frontendProcess = exec('npx expo start', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });

  frontendProcess.on('error', (error) => {
    console.error('프론트엔드 앱 시작 실패:', error);
  });

  frontendProcess.on('exit', (code) => {
    console.log(`프론트엔드 앱 종료 (코드: ${code})`);
  });
}, 3000);

// 프로세스 종료 처리
process.on('SIGINT', () => {
  console.log('\n🛑 개발 환경 종료 중...');
  backendProcess.kill();
  process.exit(0);
});
