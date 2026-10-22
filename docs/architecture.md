# 架构决策：Vercel、Monorepo、SSR、BFF

> 状态：已拍板（2026-10-22）  
> 受众：Jerry  
> 依据：[电商前端 Harness Engineering 分析](frontend-harness-analysis.md) §8 的 1–4

这四项决定商店怎么部署、代码怎么分界、页面在哪渲染、浏览器能看见哪个后端。§8 的 5–10（设计系统、登录与支付、质量条、flag、国际化、团队节奏）仍未拍板，不在本文范围。

## 已锁定

| 决策 | 选择 | 直接后果 |
| --- | --- | --- |
| 托管与流水线 | **Vercel** | `apps/web` 与 `apps/bff` 各是一个 Vercel 项目。PR 走 Preview，`main` 走 Production。 |
| 仓库拓扑 | **pnpm monorepo** | 一个仓库。Web 不引用下游服务客户端，只依赖 `packages/api-client`。 |
| 渲染策略 | **SSR** | 商店页面按请求在服务端渲染。不用 SSG，不用 ISR。结账与支付回调不缓存 HTML。 |
| 后端契约 | **BFF** | 浏览器和 Web 的服务端都只访问 `apps/bff`。下游商品、库存、订单、支付不暴露给前端。 |

## 仓库边界

```
apps/web             商店前端。Next.js App Router，只负责 SSR 页面
apps/bff             前端唯一后端。聚合目录、购物车、结算、身份
packages/api-client  Web 调用 BFF 的类型与客户端。契约的唯一落点
packages/ui          共享界面。Phase 0 只保留边界，不建完整设计系统
packages/config      共享 TypeScript、ESLint、Prettier
```

依赖方向只有一条：`apps/web` → `packages/api-client` → `apps/bff` 的 HTTP 契约。`apps/web` 不依赖 `apps/bff` 的源码。`packages/ui` 不发请求。

## 渲染

框架仍用 Next.js App Router。App Router 的组件模型是 React Server Components；**缓存策略按 SSR**，不按静态生成。

- 首页、列表、商品详情、购物车、结账、支付回调：动态渲染（`force-dynamic`），每次请求在服务端出 HTML。
- 购物车、结账、支付回调是受保护路径。CDN 可以缓存 JS、CSS 和图片，不缓存这些页面的 HTML。
- 列表和商品详情现在同样不走 ISR。以后若要改成增量静态，先改本文，再改页面。

## BFF

`apps/bff` 是商店的后端。它把目录、购物车、结算、身份收成前端需要的接口。下游服务只由 BFF 调用。

- 契约归 BFF。破坏性变更先改 `packages/api-client`，再改 Web。Web 不能绕过客户端直接拼下游 URL。
- Web 的 Server Components 在服务端调用 BFF，用来渲染页面。
- 浏览器上的写操作（加购、改数量、提交结算）走同源路径 `/api/*`。Vercel 把它反代到 BFF，这样 Cookie 留在商店域名上，浏览器拿不到下游地址。
- Phase 0 的类型先手写在 `packages/api-client`。契约稳定之前不做 codegen。

```
浏览器  →  apps/web（Vercel，SSR）
              ├─ 服务端渲染：Server Component → BFF
              └─ 浏览器写操作：/api/* 反代 → BFF
                                      └─ 下游（商品 / 库存 / 订单 / 支付，尚未建设）
```

## Vercel

| 项目 | 根目录 | 环境 |
| --- | --- | --- |
| 商店 | `apps/web` | Preview（每个 PR）、Production（`main`） |
| BFF | `apps/bff` | 与商店相同的晋升顺序。Preview 的 Web 只连 Preview 的 BFF |

Production 回滚走 Vercel 的上一部署。支付和计价实验另外要有开关；开关供应商仍是 §8 第 8 项，未定。

## 受保护路径

这些路径的 E2E、错误率和发布保护高于内容页：

| 路径 | 页面 | 缓存 |
| --- | --- | --- |
| `/` | 首页 | SSR，不缓存 HTML |
| `/c/[slug]` | 列表 | SSR，不缓存 HTML |
| `/p/[slug]` | 商品详情 | SSR，不缓存 HTML |
| `/cart` | 购物车 | SSR，不缓存 HTML |
| `/checkout` | 结账 | SSR，不缓存 HTML |
| `/checkout/return` | 支付回调 | SSR，不缓存 HTML |

## 仍开放

设计系统、登录态与购物车归属、支付与 PCI、Core Web Vitals 阈值、feature flag 供应商、国际化与多币种、团队节奏。这些不挡本文。挡 Phase 0 里登录、支付和真实下游的部分。

## 与项目要求并读

近端功能范围见 [项目要求](project-context.md)（2026-10-22 更新：这是面试实作，不是生产立项）。商品路径仍是浏览、详情、加购。Harness 分阶段计划保留，但不纳入这次面试交付，因此本轮不做 Playwright、Sentry、feature flag。已拍板的四项仍覆盖托管、仓库、渲染和契约。

| 项目要求 | 已拍板 | 处理 |
| --- | --- | --- |
| 推荐 Vite + React 单页 | Next.js App Router，商店页面 SSR | 保持已拍板 |
| 无需后端；数据用本地 mock；P2 砍掉后端对接 | BFF 持有 mock，Web 不直接 import fixture | 保持已拍板。演示没有真实下游 |
| 50 分钟单应用 | pnpm monorepo | 保持已拍板 |
| P2 砍掉登录、支付、订单 | 结账页只是动态壳，不收款 | 保持已拍板。不做支付回调页 |
| 部署加分含 Netlify / GitHub Pages | Vercel | 保持已拍板。GitHub Pages 承载不了 SSR |
| Harness 不纳入面试交付 | 四项架构仍然有效 | 不落地 harness 工具链 |

渲染边界：首页、列表、PDP 服务端渲染。购物车和结账 `force-dynamic`，响应 `Cache-Control: private, no-store`。

## 与北美 UX 选型并读

交互以 [北美选型](na-tech-ux-selection.md) 为准，除非和已拍板冲突。

| 选型建议 | 已拍板 | 处理 |
| --- | --- | --- |
| Vite + Tailwind + Radix/shadcn | Next.js + MUI | 保持 MUI。主题压成零售留白，不用 Ant Design，不用第二套组件库 |
| 动效仅 CSS，可选 Framer Motion；不要路由级大动画 | 只用 MUI 的 Fade / Grow / Slide / Collapse | 不用 Framer。页面用短 Fade，抽屉用 Slide，加购用 Grow。不做飞入购物车、Lottie、列表 stagger |
| 本地 mock + Context，不上 SSR cart | 目录和计价走 BFF；购物车交互在客户端 | Web 不 import mock。Context 只存 slug 和数量，价格由 BFF 返回 |
| 断点按 Tailwind `md` / `lg` | 四个 MUI 断点 | phone 0、pad 600、smallPc 900、largePc 1200，没有 xl。列数仍是 2 / 3 / 4 / 4 |
| 50 分钟不要 monorepo / Next | 已拍板 monorepo + Next | 保持已拍板 |

跟随该文、且与已拍板不冲突的部分：英文零售文案、`Intl` USD、粘性顶栏和购物车角标、独立 PDP、右侧 Drawer、数量步进器、加购反馈、Checkout 不收款、8–12 个 mock 商品、空车与加载态。不上 i18n 库，不上 Redux。
