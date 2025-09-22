const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// 환경변수 설정
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결
connectDB();

// 미들웨어
app.use(cors({
  origin: true, // 개발 환경에서는 모든 origin 허용
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tripmate API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: '서버 에러가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 핸들링
app.use('*', (req, res) => {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Tripmate API Server is running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});
