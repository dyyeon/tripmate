# Tripmate Backend API

Tripmate 앱의 백엔드 API 서버입니다.

## 기술 스택

- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **MongoDB** - 데이터베이스
- **Mongoose** - MongoDB ODM
- **JWT** - 인증 토큰
- **bcryptjs** - 비밀번호 해싱

## 설치 및 실행

### 1. 의존성 설치

```bash
cd server
npm install
```

### 2. 환경변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tripmate
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. MongoDB 실행

MongoDB가 설치되어 있다면 다음 명령어로 실행:

```bash
mongod
```

### 4. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

### 인증 (Authentication)

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 사용자 정보 조회

### 여행 (Trips)

- `GET /api/trips` - 모든 여행 조회
- `GET /api/trips/:id` - 특정 여행 조회
- `POST /api/trips` - 새 여행 생성
- `PUT /api/trips/:id` - 여행 수정
- `DELETE /api/trips/:id` - 여행 삭제

### 지출 (Expenses)

- `POST /api/trips/:id/expenses` - 지출 추가
- `PUT /api/trips/:id/expenses/:expenseId` - 지출 수정
- `DELETE /api/trips/:id/expenses/:expenseId` - 지출 삭제

## 데이터 모델

### User

- email: String (unique)
- password: String (hashed)
- name: String
- profileImage: String
- preferences: Object

### Trip

- user: ObjectId (User 참조)
- destination: String
- countryCode: String
- startDate: Date
- endDate: Date
- budget: Number
- memo: String
- expenses: Array
- isCompleted: Boolean
- totalSpent: Number

### Expense

- category: String (enum)
- amount: Number
- description: String
- date: Date
- location: String
