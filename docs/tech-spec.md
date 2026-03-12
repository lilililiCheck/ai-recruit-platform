# 技术选型文档

## 文档信息
| 字段 | 内容 |
|------|------|
| 版本号 | v1.0 |
| 创建日期 | 2026-03-12 |
| 项目名称 | AI Jobs - AI垂直招聘平台 |

---

## 一、技术栈选型

### 1.1 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 14.x | React全栈框架，支持SSR/SSG |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 原子化CSS框架 |
| Zustand | 4.x | 轻量级状态管理 |
| React Query | 5.x | 服务端状态管理 |
| Axios | 1.x | HTTP请求 |

### 1.2 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Node.js | 20.x | LTS版本 |
| NestJS | 10.x | Node.js企业级框架 |
| TypeScript | 5.x | 类型安全 |
| Prisma | 5.x | Type-safe ORM |
| MySQL | 8.0 | 主数据库 |
| Redis | 7.x | 缓存、会话存储 |
| Elasticsearch | 8.x | 搜索引擎 |

### 1.3 爬虫

| 技术 | 版本 | 说明 |
|------|------|------|
| Python | 3.11 | 爬虫主语言 |
| Scrapy | 2.x | Python爬虫框架 |
| Playwright | 1.x | 动态页面渲染 |
| Playwright | 1.x | 动态页面渲染 |
| Pydantic | 2.x | 数据验证 |

### 1.4 部署

| 技术 | 说明 |
|------|------|
| Docker | 容器化 |
| Docker Compose | 本地开发编排 |
| PM2 | Node.js进程管理 |

---

## 二、项目结构

```
ai-recruit-platform/
├── apps/
│   ├── web/              # Next.js前端
│   ├── api/              # NestJS后端
│   └── crawler/          # Python爬虫
├── packages/
│   ├── shared/           # 共享类型/工具
│   └── config/           # 共享配置
├── docker-compose.yml    # Docker编排
├── package.json          # 根npm配置
└── README.md
```

---

## 三、数据库设计

### 3.1 核心表

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| jobs | 岗位表 |
| companies | 公司表 |
| favorites | 收藏表 |
| subscriptions | 订阅表 |
| resumes | 简历表 |
| job_skills | 岗位技能关联表 |
| user_skills | 用户技能表 |

### 3.2 ER图设计

详见 `docs/database/schema.mmd`

---

## 四、API设计

### 4.1 RESTful API规范

- Base URL: `/api/v1`
- 认证方式: Bearer Token (JWT)
- 响应格式: JSON
- 错误码: 遵循HTTP状态码

### 4.2 核心接口

| 模块 | 路径 | 方法 | 说明 |
|------|------|------|------|
| 认证 | /auth/register | POST | 注册 |
| 认证 | /auth/login | POST | 登录 |
| 岗位 | /jobs | GET | 岗位列表 |
| 岗位 | /jobs/:id | GET | 岗位详情 |
| 岗位 | /jobs/search | GET | 搜索岗位 |
| 收藏 | /favorites | GET | 收藏列表 |
| 收藏 | /favorites | POST | 添加收藏 |
| 收藏 | /favorites/:id | DELETE | 取消收藏 |
| 用户 | /users/me | GET | 用户信息 |
| 订阅 | /subscriptions | GET | 订阅列表 |
| 订阅 | /subscriptions | POST | 创建订阅 |

---

## 五、开发规范

### 5.1 代码规范

- ESLint + Prettier
- 提交规范: Conventional Commits

### 5.2 Git工作流

- 主分支: main
- 开发分支: feature/*
- 发布分支: release/*

---

**版本记录**

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| v1.0 | 2026-03-12 | 初始版本 |
