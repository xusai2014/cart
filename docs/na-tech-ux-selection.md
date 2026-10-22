# 北美消费习惯下的前端技术与 UX 选型

> 范围：50 分钟面试式 React 海外选购 Demo 的产品交互与技术默认栈  
> 性质：**仅分析**，不含实现 / 脚手架 / PR  
> 约束来源：[项目要求](./project-context.md)、[Harness 工程分析](./frontend-harness-analysis.md)（本文件不做 harness 落地）  
> 受众：Jerry（实现前拍板）

---

## 0. 一句话结论

**默认栈：Vite + React + Tailwind + Radix/shadcn 风格 primitives + Context/Zustand + `Intl` 硬编码 en-US/USD。**  
交互默认：**列表页 → 独立 PDP → 加购 toast/inline 反馈 → 右侧 Cart Drawer**；视觉走北美零售的留白与信任信号，避免 Ant Design 默认「企业/后台」气质与国内电商的密铺/优惠墙。

---

## 1. 北美购物 UX 期待（产品交互）

北美主流零售（Amazon、Target、Best Buy、Shopify 店面气质）在 **浏览 → PDP → Cart** 上更像「商品故事 + 清晰结账承诺」，而不是「优惠信息密度竞赛」。

### 1.1 视觉与信任

| 维度 | NA 典型期待 | Demo 可落地做法（mock 即可） |
| --- | --- | --- |
| 密度 | 中低密度；卡片间距大、图优先 | 2–4 列网格（桌面）、大图 + 短标题 + 价格一行 |
| 留白 | 呼吸感强，少边框堆叠 | 避免密密麻麻边框卡；用间距与字重分层 |
| 字体 | 干净无衬线，价格字重清晰 | 系统或一个展示字体即可；价格 `$12.99` 突出 |
| 信任信号 | 星级评价、评价数、免运费/送达提示 | 列表可简化星级；PDP 放 `★★★★☆ 128 reviews`、`Free shipping over $35` 文案条（假数据） |
| CTA | 主按钮一个、颜色对比足 | 主色单一；PDP 只有一个主 CTA：`Add to cart` |

### 1.2 导航

- **桌面**：粘性顶栏（Logo / 可选 Search / Cart 图标 + **数量角标**）是默认心智模型。
- **移动**：仅靠汉堡菜单不够；P1 可加底部栏或悬浮 Cart；P0 至少保证顶栏 Cart 可点、角标可见。
- 搜索框可占位（P1 再接逻辑），但顶栏结构应「看起来完整」。

### 1.3 购物车行为

| 行为 | 推荐 | 说明 |
| --- | --- | --- |
| 购物车表面 | **Drawer（右侧滑出）** | NA 店面常见；不打断列表/PDP；50 分钟比完整 Cart 页更省路由 |
| 数量 | Stepper（− / 数字 / +） | 比纯输入框更符合习惯；P0 可只在 Drawer 内改数量 |
| 加购反馈 | **短 toast 或按钮态**（Added ✓）+ 角标 +1 | 不要静默；也不要整页跳转 |
| 结账 | `Checkout` 按钮可 **disabled / mock** | 文案保留，满足「客户演示」叙事；实现放 P2 |

### 1.4 货币与格式

- 价格：**USD**，展示 `$12.99`（两位小数；整数也可用 `$12.00` 保持一致）。
- 用 `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`，禁止手写 `"$" + price` 拼字符串（易漏小数/千分位）。
- 日期若出现：`en-US`（如 `Oct 22, 2026`）；Demo 多数场景可不显示日期。

### 1.5 CTA 文案（英文）

| 场景 | 推荐文案 | 避免 |
| --- | --- | --- |
| 加购 | `Add to cart` | `Buy`（易误解为立刻支付）、`加入购物车` |
| 结算 | `Checkout`（可禁用） | `Settle` / `Pay now`（无支付时） |
| 空车 | `Your cart is empty` + `Continue shopping` | 空白无引导 |
| 运费提示 | `Free shipping on orders over $35` | 冗长优惠券堆叠 |

### 1.6 与「感觉不对」的对比（短）

| 易显得「非 NA / 非客户向」 | 为何 |
| --- | --- |
| 超密网格、小图多字、红黄促销满屏 | 像国内电商信息墙，不像国际零售落地页 |
| 进站先弹优惠券/登录墙 | NA 浏览路径应先商品，后转化施压 |
| 默认 Ant Design 表格/表单灰蓝后台风 | 读起来像 Admin，不像 Storefront |
| 仅汉堡、无 Cart 角标 | 移动端找不到「钱路径」入口 |
| 加购无反馈 | 演示时评委/客户感知「坏了」 |

---

## 2. 组件库：NA 观感 × 50 分钟速度

面向 **本 Project**（Vite+React、英文店面、禁模板、要响应式），而非通用企业后台。

| 方案 | NA 零售观感（开箱） | 50 分钟定制成本 | a11y | 移动 | Bundle | Agent 友好度 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Tailwind + Radix / shadcn 风格** | 高：易做出「Shopify/现代 DTC」留白 | 中：要写一点样式，但模式固定 | 好（Radix） | 好（utility） | 可控 | 高（文档与示例多） | **推荐默认** |
| **MUI** | 中：偏 Material/产品后台，可 theme 成零售 | 低～中：组件全，theme 要压掉默认感 | 好 | 好 | 偏大 | 高 | 可接受备选（熟 MUI 时） |
| **Chakra** | 中高：偏干净产品风 | 中 | 好 | 好 | 中 | 中高 | 备选；生态热度略低于前两者 |
| **Ant Design** | **低（默认）**：企业/亚洲后台感强 | 高：要重 theme 才像店面 | 中 | 中 | 中大 | 高 | **Demo 默认避免**；除非已有成熟 storefront theme 且极熟 |

### 推荐

**Tailwind CSS + Radix primitives（或等价 shadcn 风格拷贝组件，非整站模板）。**

**理由：**

1. 视觉默认更接近国际零售，而不是 Admin。  
2. Drawer、Dialog、Toast 用 Radix 可快速拿到键盘/焦点行为，省 a11y 坑。  
3. 响应式断点与间距用 utility 改，50 分钟内迭代最快。  
4. Agent 生成 Tailwind 类名与小组件准确率通常高于「先拆 Ant 主题」。  
5. 不违反「禁商城模板」：用的是 **原子组件/样式系统**，不是现成整站。

### 明确避免

- **Ant Design 默认皮肤直接铺店面**（除非 Jerry 有现成、已验证的重 theme 方案且 10 分钟内能定调）。  
- 引入 **完整商城 UI Kit / 主题市场模板**。  
- 同时装两套组件库（时间与样式冲突双杀）。

### 若选 MUI

- 立刻用 `createTheme` 抬圆角、换主色、加大间距、去掉密集 Table 气质。  
- 优先 `Drawer` + `Badge` + `Button`，少用 `DataGrid`/`Table` 展示商品。

---

## 3. Localization / i18n 姿态

### 3.1 「英文优先」之外仍要有的本地化意识

| 项 | 50 分钟做法 |
| --- | --- |
| 文案语气 | 简洁、祈使、零售口语（Add to cart / Continue shopping） |
| 货币 | 仅 USD；所有价格走 `Intl` |
| 数字 | `en-US`（千分位逗号） |
| 可选结构 | 文案可集中在 `copy.ts` 常量对象，**不**上完整 i18n 框架 |

### 3.2 是否安装 i18n 库？

**推荐：NO。**  
P2 已砍「完整多语言」；`react-i18next` 等会吃掉脚手架与文案迁移时间，演示收益近零。

**推荐写法：**

```ts
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
usd.format(12.99); // "$12.99"
```

日后若要多语言：把 `copy.ts` 键值结构留下即可，不必现在装库。

### 3.3 文案指南（短）

| 类型 | 指南 |
| --- | --- |
| 商品名 | 英文短名 + 可选短描述；避免机翻腔 |
| 按钮 | 动词开头、首词大写 Title Case 常见于零售按钮 |
| 空车 | 一句说明 + 回列表 CTA |
| 错误/缺货 | 温和直述（`Out of stock`），勿夸张 |

---

## 4. Motion / 动画

### 4.1 NA 零售常见「轻」动效

- 加购：按钮短暂 `Added` 态或 toast 淡入淡出  
- Cart Drawer：侧滑 + 遮罩淡入  
- 桌面：卡片/按钮 hover（阴影或轻微上移，**幅度小**）  
- **不是**：全屏 Lottie、商品 3D 转、抛物线飞入购物车、页面切换大动画

### 4.2 50 分钟推荐

| 选项 | 建议 |
| --- | --- |
| **CSS transitions**（transform/opacity） | **首选**；零依赖、够演示 polish |
| Framer Motion「lite」 | 仅当 Jerry 极熟且 Drawer 已有现成片段；否则不值得 |
| 无动画 | 可接受，但加购反馈会变「哑」——至少保留 toast/态变化 |

**取舍：** 1～2 个微反馈（加购 + Drawer）对「可向客户演示」的增益 > 引入动画库的安装与调试成本。

### 4.3 明确不要动画（P2）

- 列表入场 stagger、骨架屏复杂 shimmer、滚动视差、Lottie 品牌墙、飞入购物车抛物线、路由级 page transition。

---

## 5. 交互地图（对齐 P0 / P1 / 砍）

| 表面 | 具体 UI 选择 | 优先级 |
| --- | --- | --- |
| 商品列表 / 网格 | 响应式 grid：手机 2 列、平板 3、桌面 4；图 + 名 + 价（+ 可选星级） | **P0** |
| 详情 | **独立 PDP 路由或页内全宽详情**（优先 page/route）；Modal 仅作时间不够时的降级 | **P0**（形态：page 优先） |
| 加购反馈 | 按钮 loading→`Added` 或短 toast + header badge +1 | **P0** |
| 购物车表面 | **右侧 Drawer**；内含行项目、单价、小计、Checkout（mock/disabled） | **P0**（Drawer）；完整 Cart 页可砍 |
| 数量/删除 | Drawer 内 stepper + remove | **P1**（P0 至少能加与看列表） |
| 搜索/筛选 | 顶栏 search 或类目 chips | **P1** |
| 空态 / Loading | 空车文案；列表简单 skeleton 或 spinner | **P1** |
| 移动底栏 / 悬浮 Cart | 底栏 Home+Cart 或 FAB | **P1** |
| Checkout 真流程 / 登录 / 支付 | — | **砍（P2）** |
| 优惠券墙 / 推荐瀑布 | — | **砍** |

### 响应式断点行为（建议）

| 断点 | 行为 |
| --- | --- |
| `< md` | 2 列网格；Drawer 近全宽；顶栏精简（Logo + Cart） |
| `md–lg` | 3 列；Drawer ~400px |
| `≥ lg` | 4 列；粘性顶栏可含 Search 占位 |

**Sticky header + cart badge：全断点 P0。**

---

## 6. 与 Harness 的契合（短）

长期 harness（见 [frontend-harness-analysis.md](./frontend-harness-analysis.md)）会走向 Next、token、a11y/性能门禁等。本 Demo 选型应 **可升级、可抛弃捷径清晰**：

| 选择 | 长期可保留 | 50 分钟捷径（日后可换） |
| --- | --- | --- |
| Tailwind + 设计 token 意识（颜色/间距 CSS 变量） | ✅ 可迁入 `packages/ui` | 先少变量、类名直写 |
| Radix/a11y 正确的 Drawer/Dialog | ✅ 直接进设计系统 | — |
| `Intl` + en-US copy 常量 | ✅ 日后接 i18n 资源 | 不上 i18n 库 |
| Vite SPA | ⚠️ harness 倾向 Next | Demo 用 Vite 正确；日后迁 App Router |
| Context/Zustand 购物车 | ✅ 逻辑可抽 hook | 无持久化、无 SSR cart |
| CSS 微动效 | ✅ | 勿绑死某一动画库 API |
| 无 E2E / 无 CWV 预算 | — | harness Phase 0 再补；Demo 用手动录屏验证 |

**原则：** 现在选「看起来像 NA 店面 + 语义正确的 primitives」；不要为了 harness 在 50 分钟内上 monorepo/Playwright/Storybook。

---

## 7. 本 Project 推荐默认栈

### 一行默认栈

**Vite + React + TypeScript + Tailwind + Radix（shadcn 风格）+ Context 或 Zustand + 本地 mock + `Intl` en-US/USD + CSS 微动效；Cart = Drawer。**

### Do

- 英文 UI；价格一律 `Intl` USD  
- 粘性顶栏 + Cart badge；加购有可见反馈  
- PDP 独立、信息清晰（图、价、短描述、信任一行、Add to cart）  
- 手机与桌面都走通「浏览 → 加购 → 开 Cart」  
- Checkout 按钮可禁用但文案在  
- 组件拆分干净，便于录屏与口述取舍  

### Don’t

- 商城/网站成品模板  
- Ant Design 默认皮肤硬套店面（除非重 theme 且极熟）  
- 装 i18n / Redux / 重动画库  
- 优惠券墙、登录、真支付、密铺网格  
- 只做桌面或加购无反馈  
- 为 harness 提前上 Next monorepo / CI 门禁  

---

## 8. 需 Jerry 拍板的开放决策

以下会改变默认栈或交互骨架；**不拍板则按 §0 / §7 执行**：

1. **组件层：Tailwind+Radix/shadcn vs MUI**  
   - 若更熟 MUI 且能 10 分钟内 theme 成零售风 → 可改 MUI。  
   - 否则保持 Tailwind+Radix。

2. **Cart：Drawer（推荐）vs 独立 Cart 页**  
   - Drawer 更省时间、更像 NA 店面。  
   - 若希望路由更「完整」可 P0 Drawer + P1 再加 `/cart`。

3. **PDP：独立路由页 vs 列表展开/Modal**  
   - 推荐独立页（演示叙事更清晰）。  
   - 时间极度不够时 Modal/抽屉详情可降级，但需在交付说明写明。

4. **动效：仅 CSS vs 引入 Framer Motion**  
   - 默认仅 CSS；仅在已有熟练片段时引入 Framer。

5. **部署目标（加分）：Vercel vs Netlify vs GitHub Pages**  
   - 与 harness 长期 Vercel 路径一致时优先 Vercel；不影响 UI 栈，但影响最后 5～10 分钟安排。

6. **状态库：Context vs Zustand**  
   - 购物车跨列表/PDP/Drawer：二者皆可；团队/个人更熟者优先，不上 Redux。

---

## 附录：与项目优先级的对齐备忘

| 项目 P0 | 本文默认落地 |
| --- | --- |
| 列表 8–12 mock | 留白网格 + USD |
| 详情 | 独立 PDP |
| 加购 + 数量/列表 | Drawer + badge + 反馈 |
| 响应式 | 断点表 §5 |
| 国际风视觉 | Tailwind 零售风；避 Ant 默认 |

**验收口径（演示）：** 桌面与手机各走一遍「打开站点 → 点商品 → Add to cart → 打开 Cart 看到商品与小计 →（可选）改数量」。Checkout 可为 disabled，但客户能理解「下一步是结账」。
