# cart

电商平台。当前先用的工程基线：

- [电商前端 Harness Engineering 分析](docs/frontend-harness-analysis.md)
- [项目要求](docs/project-context.md)
- [北美消费习惯下的前端技术与 UX 选型](docs/na-tech-ux-selection.md)
- [架构决策：Vercel、Monorepo、SSR、BFF](docs/architecture.md)

## 本地运行

Node.js 24、pnpm 12。

```powershell
pnpm install
pnpm dev
```

- 商店：http://localhost:3000
- BFF：http://localhost:3001

商店页面在服务端请求 `BFF_URL`（默认 `http://127.0.0.1:3001`）。浏览器加购走同源 `/api`，由 Next rewrite 转到 BFF。Mock 数据只在 `apps/bff`。
