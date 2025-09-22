# Tripmate - 여행 계획 및 지출 관리 앱

Tripmate는 여행 계획을 세우고 지출을 관리할 수 있는 모바일 앱입니다. React Native와 Expo를 사용하여 개발되었으며, Express.js와 MongoDB를 백엔드로 사용합니다.

## 🚀 주요 기능

- **사용자 인증**: 회원가입, 로그인, 로그아웃
- **여행 계획**: 여행지 선택, 기간 설정, 예산 계획
- **지출 관리**: 카테고리별 지출 기록 및 관리
- **예산 추적**: 실시간 예산 사용량 및 남은 예산 확인
- **국가별 여행**: 다양한 국가의 여행 계획 지원

## 🛠 기술 스택

### 프론트엔드

- **React Native** - 모바일 앱 개발
- **Expo** - 개발 플랫폼
- **React Navigation** - 네비게이션
- **AsyncStorage** - 로컬 데이터 저장
- **React Native Calendars** - 캘린더 컴포넌트

### 백엔드

- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **MongoDB** - 데이터베이스
- **Mongoose** - MongoDB ODM
- **JWT** - 인증 토큰
- **bcryptjs** - 비밀번호 해싱

## 📱 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd tripmate
```

### 2. 프론트엔드 의존성 설치

```bash
npm install
```

### 3. 백엔드 의존성 설치

```bash
cd server
npm install
cd ..
```

### 4. MongoDB 설치 및 실행

MongoDB를 설치하고 실행하세요:

```bash
# macOS (Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Windows
# MongoDB Community Server를 다운로드하여 설치
# 서비스에서 MongoDB 실행

# Linux
sudo systemctl start mongod
```

### 5. 백엔드 서버 실행

```bash
npm run start:backend
```

### 6. 프론트엔드 앱 실행

새 터미널에서:

```bash
npm start
```

### 7. 개발 환경 통합 실행 (권장)

```bash
npm run start:dev
```

## 📱 Expo Go에서 테스트

1. **Expo Go 앱 설치**

   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **네트워크 설정**

   - 컴퓨터와 모바일 기기가 같은 Wi-Fi 네트워크에 연결되어 있는지 확인
   - `config/api.js` 파일에서 `API_BASE_URL`을 실제 IP 주소로 변경:

   ```javascript
   export const API_BASE_URL = "http://YOUR_IP_ADDRESS:3000/api";
   ```

3. **IP 주소 확인**

   ```bash
   # Windows
   ipconfig

   # macOS/Linux
   ifconfig
   ```

4. **앱 실행**
   - `npm start` 실행 후 QR 코드를 Expo Go로 스캔
   - 또는 Expo Go에서 프로젝트 URL 입력

## 🔧 개발 환경 설정

### 환경 변수 설정

백엔드 서버의 `.env` 파일을 생성하세요:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tripmate
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### API 설정

`config/api.js`에서 API 기본 URL을 설정하세요:

```javascript
export const API_BASE_URL = "http://YOUR_IP_ADDRESS:3000/api";
```

## 📁 프로젝트 구조

```
tripmate/
├── app/                    # React Native 앱 (Expo Router)
│   ├── (tabs)/            # 탭 네비게이션 화면
│   │   ├── HomeScreen.js  # 홈 화면
│   │   ├── PlanningScreen.js # 여행 계획 화면
│   │   ├── SpendingScreen.js # 지출 관리 화면
│   │   ├── LoginPage.js   # 로그인 화면
│   │   ├── SignupPage.js  # 회원가입 화면
│   │   └── TripsContext.js # 여행 데이터 컨텍스트
│   └── index.tsx          # 앱 진입점
├── server/                # 백엔드 서버
│   ├── models/           # 데이터베이스 모델
│   ├── routes/           # API 라우트
│   ├── middleware/       # 미들웨어
│   └── server.js         # 서버 진입점
├── services/             # API 서비스
├── components/           # 재사용 가능한 컴포넌트
├── config/              # 설정 파일
└── assets/              # 이미지 및 폰트
```

## 🔌 API 엔드포인트

### 인증

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 사용자 정보 조회

### 여행

- `GET /api/trips` - 여행 목록 조회
- `POST /api/trips` - 새 여행 생성
- `GET /api/trips/:id` - 특정 여행 조회
- `PUT /api/trips/:id` - 여행 수정
- `DELETE /api/trips/:id` - 여행 삭제

### 지출

- `POST /api/trips/:id/expenses` - 지출 추가
- `PUT /api/trips/:id/expenses/:expenseId` - 지출 수정
- `DELETE /api/trips/:id/expenses/:expenseId` - 지출 삭제

## 🐛 문제 해결

### 일반적인 문제들

1. **MongoDB 연결 실패**

   - MongoDB가 실행 중인지 확인
   - 연결 문자열이 올바른지 확인

2. **네트워크 연결 실패**

   - 컴퓨터와 모바일 기기가 같은 네트워크에 있는지 확인
   - 방화벽 설정 확인
   - IP 주소가 올바른지 확인

3. **Expo Go에서 앱 로드 실패**
   - 네트워크 연결 확인
   - Expo CLI 최신 버전 사용
   - 캐시 클리어: `expo start -c`

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해 주세요.

---

**Tripmate**로 더 스마트한 여행을 계획하세요! ✈️
