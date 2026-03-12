# AI Jobs - AI垂直招聘平台

聚焦AI领域的垂直招聘岗位聚合平台，帮助求职者一站式获取全网AI岗位信息。

## 技术栈

### 前端
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (状态管理)
- React Query (服务端状态)

### 后端
- NestJS
- TypeScript
- TypeORM / Prisma
- MySQL 8.0
- Redis
- JWT 认证

### 爬虫
- Python
- Scrapy
- Playwright

## 项目结构

```
ai-recruit-platform/
├── apps/
│   ├── web/              # Next.js前端应用
│   ├── api/              # NestJS后端API
│   └── crawler/          # Python爬虫
├── docs/                 # 项目文档
└── docker-compose.yml    # Docker配置
```

## 快速开始

### 前置要求
- Node.js 20+
- Docker & Docker Compose
- Python 3.11+ (用于爬虫)

### 1. 克隆项目

```bash
git clone <repository-url>
cd ai-recruit-platform
```

### 2. 启动基础服务

```bash
docker-compose up -d
```

这将启动:
- MySQL (端口 3306)
- Redis (端口 6379)
- Elasticsearch (端口 9200)
- Kibana (端口 5601, 可选)

### 3. 安装前端依赖

```bash
npm install
npm run dev:web
```

前端将运行在 http://localhost:3000

### 4. 配置后端

```bash
cd apps/api
cp .env.example .env
# 编辑 .env 文件，配置数据库连接
```

### 5. 启动后端

```bash
npm run start:dev
```

后端API将运行在 http://localhost:4000

## API文档

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/login | 用户登录 |

### 岗位

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/jobs | 岗位列表 |
| GET | /api/v1/jobs/:id | 岗位详情 |
| GET | /api/v1/jobs/search | 搜索岗位 |
| GET | /api/v1/jobs/categories | 岗位分类 |

### 收藏

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/favorites | 收藏列表 |
| POST | /api/v1/favorites | 添加收藏 |
| DELETE | /api/v1/favorites/:id | 取消收藏 |

### 订阅

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/subscriptions | 订阅列表 |
| POST | /api/v1/subscriptions | 创建订阅 |
| PUT | /api/v1/subscriptions/:id | 更新订阅 |
| DELETE | /api/v1/subscriptions/:id | 删除订阅 |

## 开发规范

- 使用 ESLint + Prettier
- 提交信息遵循 Conventional Commits
- 分支策略: main / feature/*

## License

MIT
