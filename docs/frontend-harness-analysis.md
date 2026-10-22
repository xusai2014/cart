# 电商前端 Harness Engineering 分析

> 受众：Jerry（软件工程师）  
> 范围：绿地面向的前端工程方向（尚无仓库）  
> 性质：分析与决策建议，不含实现 / 脚手架 / PR

---

## 1. 这里的 Harness Engineering 指什么

**定义（前端语境）**：有意搭建的一套「约束 + 反馈环 + 自动化」，让团队在快速改代码、快速上线的同时，把 UX 与稳定性压进可重复的默认路径里——而不是靠个人自觉或事后救火。

| 维度 | Harness 做什么 | 「只选框架」做什么 |
| --- | --- | --- |
| 约束 | lint/type/契约/性能预算/关键路径保护默认开启 | 给组件与路由语法 |
| 反馈环 | 本地秒级、PR 分钟级、线上分钟级信号 | 运行时本身无质量信号 |
| 自动化 | codegen、preview、canary、kill switch | 需另搭 CI/CD |
| 价值 | 把「快」与「稳」绑在同一条交付管线上 | 只降低写 UI 的语法成本 |

**一句话**：框架是发动机；harness 是油门、刹车、仪表盘与护栏。电商前端的护栏尤其要盖住目录、PDP、购物车、结账这条钱路径。

---

## 2. 目标 ↔ Harness 层映射

| 业务目标 | 主要 harness 层 | 关键机制（示例） |
| --- | --- | --- |
| 快速开发 | Local DX | 模板/codegen、typed API、Storybook、本地 Playwright、热更新与共享包 |
| 快速部署 | Deploy + 部分 CI | Preview 部署、环境晋升、CDN/edge 缓存失效策略、一键回滚 |
| 用户体验 | Local + Merge + Runtime | Core Web Vitals 预算、视觉/a11y 门禁、RUM、结账关键路径合成监控 |
| 系统稳定 | Merge + Deploy + Runtime | 类型/契约测试、错误率 SLO、feature flag、canary、kill switch |

**映射原则**：每个目标至少有一层「挡在合并前」和一层「挡在线上」；只靠线上监控等于没有 harness，只靠本地规范等于无法规模化。

---

## 3. 推荐 Harness Stack（电商前端，偏 Vercel 友好）

意见化推荐，括号内为简要替代。

| 决策点 | 推荐 | 理由 | 简要替代 |
| --- | --- | --- | --- |
| 仓库拓扑 | **Monorepo**（apps + packages） | 设计系统、API client、配置共享成本最低；电商前后端契约变更频繁 | 多仓 + 私有包（团队更大、权限隔离强时） |
| 框架 | **Next.js（App Router）** | SSR/ISR/RSC、路由级缓存、与 Vercel Preview/Edge 契合；PDP/列表 SEO 友好 | Remix / Nuxt / 自建 Vite+SSR（团队已有栈时） |
| 包管理 | **pnpm + workspace** | 磁盘与依赖隔离好，monorepo 成熟 | npm/yarn workspaces |
| Lint/Format | ESLint + Prettier（或 Biome 二选一统一） | 统一风格与防呆；Biome 更快但生态迁移成本需评估 | 仅 Biome |
| 类型 | TypeScript strict | 契约与重构安全网 | — |
| 单元/组件 | Vitest + Testing Library | 快、与 Vite 生态一致 | Jest |
| 组件文档/交互 | Storybook | 本地 harness 的 UI 反馈环 | Ladle（更轻） |
| E2E | Playwright | 结账关键路径稳定性好于 Cypress 在多数团队实践 | Cypress |
| 视觉 | Playwright screenshot / Chromatic（择一） | 防回归；勿过早全站像素对比 | Percy |
| A11y | axe 进 CI（关键页）+ 手工抽检 | 合规与转化相关 | — |
| 性能预算 | Lighthouse CI / Web Vitals 阈值进 PR 或 nightly | 把 UX 变成可失败的数字 | 仅 RUM 后知后觉 |
| Feature flags | 服务端可读 flag（如 Flags SDK / LaunchDarkly 等） | 安全灰度、紧急关停结账实验 | 纯客户端 flag（弱） |
| Preview | 每 PR 自动 Preview URL | 产品/设计并行验收，缩短「部署」体感 | 手工 staging |
| CDN/Edge | Vercel Edge + 缓存标签/路径失效 | 目录与 PDP 读多写少 | Cloudflare + 自建源 |
| 错误监控 | Sentry（或等价） | 发布关联、sourcemap、release health | Datadog RUM Errors |
| RUM / Web Vitals | Vercel Analytics / Speed Insights 或 GA4+自定义 | 真实用户体验闭环 | 仅合成监控 |
| 契约 | OpenAPI/GraphQL codegen + contract test | 前后端并行、防破坏性变更 | 手工 mock 漂移 |

**电商特化提醒**：把「加购 → 结算 → 支付回调页」列为 **protected paths**——E2E、性能、错误率、flag 默认保护级别高于内容页。

---

## 4. Harness 分层模型

```
Local  →  Merge  →  Deploy  →  Runtime
  DX        门禁       晋升        观测与熔断
```

### 4.1 Local harness（开发者机器）

- App / package 模板；共享 ESLint/TS/Tailwind（或设计 token）配置  
- API client **codegen**（OpenAPI/GraphQL → typed hooks）  
- Storybook：组件与关键购物流原子状态  
- Playwright 本地跑「结账冒烟」子集（秒～分钟级）  
- 禁止：本地跳过 typecheck 的默认脚本

### 4.2 Merge harness（CI，必须过才能合）

| 门禁 | 建议级别 | 说明 |
| --- | --- | --- |
| format / lint / typecheck | 阻断 | 无例外主分支 |
| unit + component | 阻断 | 覆盖纯逻辑与关键组件 |
| contract / schema diff | 阻断（对 API 包） | 破坏性变更需显式审批 |
| E2E 冒烟（结账等） | 阻断，**集小而稳** | 大而全 E2E 放 nightly |
| a11y（关键页） | 警告 → 逐步阻断 | Phase 1 再收紧 |
| 性能预算 | 警告或 nightly 阻断 | 防 flaky 拖垮吞吐 |
| 视觉回归 | 可选 / 设计系统包优先 | 全站像素对比易碎 |

### 4.3 Deploy harness

- **Preview（每 PR）→ Staging → Production**  
- Production：canary / 百分比发布（平台或 flag 层）  
- 一键 **rollback**（部署版本 + flag 关停双通道）  
- 缓存：PDP/列表带 tag 的失效策略写进 runbook，避免「修了代码 CDN 还在旧页」

### 4.4 Runtime harness

- SLO：JS error rate、结账 API 失败率、LCP/INP/CLS（分路由）  
- 告警：仅对「用户可感知 + 可行动」的指标（避免告警疲劳）  
- RUM 与 release 关联  
- **Kill switch / feature flag**：促销模块、实验计价、第三方支付 SDK 可瞬间关闭  
- 合成监控：结账关键路径定期跑（补 RUM 采样盲区）

---

## 5. 把 UX + 稳定性编成质量条

建议把「感觉好」写成可失败的数字与路径策略（具体阈值落地前用基线测量校准）。

| 类别 | 质量条（方向性） | 作用范围 |
| --- | --- | --- |
| Core Web Vitals | 关键路由：LCP / INP / CLS 设 p75 预算；超预算 PR 警告或阻断 | 首页、列表、PDP、购物车 |
| 错误率 SLO | 前端 unhandled error、结账相关 API 4xx/5xx 分路径 | Runtime + 发布门禁 |
| 结账关键路径 | 固定 E2E 冒烟 + 合成监控；变更需 label 或额外审批 | Merge + Runtime |
| 契约 | 后端 schema 变更 → 前端 client 再生；破坏性变更红灯 | Merge |
| 可用性 | 结账/支付相关组件 a11y 抽检进 CI | Merge |
| 发布安全 | 高风险功能默认 flag off；观察窗口后再全量 | Deploy + Runtime |
| 回滚就绪 | 每次 prod 发布可在 N 分钟内回滚到上一版本 | Deploy |

**编码 UX 的要点**：预算挂在**路由/页面类型**上，而不是全站一个平均数——目录页与结账页的权重要分开。

---

## 6. 分阶段落地

### Phase 0 — Foundation（先能「正确重复交付」）

**做：**

- Monorepo 骨架约定（apps/web、packages/ui、packages/api-client、packages/config）  
- TS strict、lint/format、CI 基础门禁  
- Preview 部署  
- Sentry + 基础 Web Vitals  
- 结账路径 **少量** Playwright 冒烟  
- Feature flag 基础设施（即使暂时只用 1～2 个开关）

**明确先不做：**

- 全站视觉回归、完整设计系统站点、复杂多环境矩阵  
- 大量 E2E、自定义可观测性平台、多框架混用  
- 过度 codegen（无稳定 API 契约时）

### Phase 1 — Speed（在护栏内加速）

**做：**

- 模板 + codegen 成熟化；Storybook 覆盖设计系统  
- 契约测试与 API 包版本策略  
- 性能预算进入 PR（关键路由）  
- a11y 门禁收紧  
- Staging 晋升与基础 canary  
- 缓存/失效 runbook

**仍不做：**

- 用 E2E 替代单测的「万能套件」  
- 为每个微服务单独前端仓（除非组织强制）

### Phase 2 — Safety at scale（流量与团队变大）

**做：**

- 分路由 SLO + 告警分级  
- 结账保护策略（变更冻结窗口、强制 flag、合成监控加密）  
- 视觉回归（设计系统 / 关键营销模板）  
- 更细的实验平台与审计  
- 多区域/边缘渲染策略评估（若业务需要）

**仍谨慎：**

- 把所有质量检查都设为 merge blocker（吞吐会塌）  
- 无产品优先级的「工具完整主义」

---

## 7. 风险与反模式

| 反模式 | 为何伤电商前端 | 缓解 |
| --- | --- | --- |
| Over-harnessing | 工具链比业务重，新人一周才能跑起来 | Phase 门禁；每个工具必须对应目标表中的一行 |
| Flaky E2E 作 merge blocker | 队列堵塞，团队绕过 CI | 冒烟极小集阻断；全量 nightly；隔离第三方支付 mock |
| 工具堆叠重复 | ESLint+Biome、Jest+Vitest 并存 | 每层只留一个默认答案 |
| 忽略钱路径 | 内容页很稳，结账偶发亏钱 | protected paths 单独预算与发布策略 |
| 只有框架没有 runtime harness | 周五发布，周一才知 LCP 崩了 | RUM + release 关联 + kill switch 同期上 |
| Preview 当 staging | 数据/支付环境不一致 | Preview 验 UI；Staging 验集成与支付沙箱 |
| 性能只测实验室 | 实验室绿、真机红 | 预算双轨：合成 + RUM |
| Flag 变成永久技术债 | 代码分叉失控 | Flag 生命周期与清理 SLA |

---

## 8. Jerry 实施前必须拍板的开放决策

按「不拍板就无法开工」优先。1–4 已于 2026-10-22 拍板，落地说明见 [架构决策](architecture.md)。近端交付范围见 [项目要求](project-context.md)。

1. **托管与流水线**：已定 **Vercel**（Preview / Production）。  
2. **仓库拓扑**：已定 **pnpm monorepo**。包边界见架构文档：`apps/web`、`apps/bff`、`packages/ui`、`packages/api-client`、`packages/config`。  
3. **渲染策略**：已定 **服务端渲染（SSR）**。首页、列表、PDP 在服务端渲染；结账保持动态，禁止静态缓存。购物车与支付回调同样不缓存 HTML。  
4. **后端契约形态**：已定 **BFF**。BFF 是前端拥有的契约边界；`apps/bff` 拥有这份契约，破坏性变更先改 `packages/api-client`。  
5. **设计系统**：从零自建 vs 基于现有 UI 库封装；token 与品牌规范来源？  
6. **认证与结账集成**：登录态、购物车归属（访客/用户）、支付 SDK 与 PCI 约束对 E2E/预览环境的限制？  
7. **质量条所有权**：谁定 CWV/错误率阈值？产品是否接受「超预算不可合」？  
8. **Flag 供应商与治理**：自建 vs 商业；生产 kill switch 的值班与权限模型？  
9. **国际化/多站点**：是否 Day-1 需要 i18n、多币种、多仓配——影响路由与缓存 harness。  
10. **团队规模与节奏**：预期并行 PR 数、是否需要变更冻结（大促）——决定 Phase 2 提前量。

---

## 附录：建议的「先选后建」顺序

1. 拍板 §8 中 1–4（托管、仓、渲染、契约）——已完成，见 [架构决策](architecture.md)  
2. 落 Phase 0 最小 harness（能 Preview + 冒烟 + 错误监控）  
3. 用 1～2 周真实流量/预发基线校准 §5 预算数字  
4. 再开 Phase 1 的速度项（codegen、Storybook、契约测试）  
5. 大促或团队翻倍前启动 Phase 2 的安全项

**结论**：电商前端的 harness 不是「多装几个工具」，而是把 **结账关键路径、性能预算、契约、Preview→Prod 晋升、线上熔断** 串成一条默认交付路径；框架选择只是其中一块砖，真正决定快与稳的是分层反馈环与分阶段收紧门禁。
