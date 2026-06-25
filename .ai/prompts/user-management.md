# AI 编码 Agent 开发任务

## 角色

你是一个在现有前端项目中工作的 AI 编码 Agent。

## 当前功能

user-management

## 必须阅读

- specs/features/user-management/feature.spec.md
- specs/features/user-management/ui.spec.md
- specs/features/user-management/data.spec.md
- specs/features/user-management/behavior.spec.md
- specs/features/user-management/verify.spec.md
- specs/features/user-management/plan.md
- specs/features/user-management/tasks.md
- .ai/project-profile.md
- .ai/rules/change-safety.md
- .ai/rules/component.md
- .ai/rules/api.md

## 硬性约束

- 按 tasks.md 顺序执行。
- 不要实现不在范围内的功能。
- 不要顺手重构无关文件。
- 不要修改受保护文件。
- 展示组件不能直接请求 API。
- 表单提交失败必须保留用户输入。
- 必须补充验收标准对应的测试。

## 上下文

# 项目画像

由 `ai-fe scan` 生成。

## 技术栈

- Vite
- TypeScript

## 命令

- dev: `tsc -p tsconfig.json && node dist/cli.js`
- build: `tsc -p tsconfig.json`
- typecheck: `tsc -p tsconfig.json --noEmit`
- lint: `tsc -p tsconfig.json --noEmit`
- test: `node dist/cli.js doctor`

## 目录信号

- package.json
- src/args.ts
- src/cli.ts
- src/commands/adr.ts
- src/commands/doctor.ts
- src/commands/feature.ts
- src/commands/init.ts
- src/commands/rules.ts
- src/commands/scan.ts
- src/commands/workflow.ts
- src/core/config.ts
- src/core/feature-files.ts
- src/core/project-scan.ts
- src/core/tasks.ts
- src/core/templates.ts
- src/core/validation.ts
- src/core/verify.ts
- src/node-shims.d.ts
- src/types.ts
- src/utils/exec.ts
- src/utils/fs.ts
- src/utils/logger.ts
- src/utils/prompt.ts
- tsconfig.json

## 当前风险

- 大范围重构前先确认受保护文件。
- UI 变更需要确认加载、空态、错误态和权限显隐。
- 如果自动识别不完整，请在 `verification/config.json` 中补充缺失脚本。

## AI 约束

- 不要重构无关文件。
- 优先沿用本项目已有模式，不要随意引入新架构。
- 汇报完成前必须运行验证。

## 功能资料

### feature.spec.md

# 功能规格：用户管理

- ID: `user-management`
- 功能名称：`user-management`
- 类型：`crud-page`
- 状态：`planned`
- 路由：`/admin/users`

## 目标

实现一个用户管理页面，支持搜索、分页、新增和编辑用户。

## 范围

### 包含

- 展示用户列表
- 按关键词搜索用户
- 分页浏览用户
- 新增用户
- 编辑用户

### 不包含

- 删除用户
- 批量导入
- 角色分配

## 用户

- 管理员
- 运营人员

## 能力

- 用户列表
- 搜索
- 分页
- 新增用户
- 编辑用户

## 假设

- 接口字段后续根据真实 API contract 补齐。

## 风险

- 旧项目中可能已有不一致的表单处理模式。

### ui.spec.md

# UI 规格：用户管理

## 页面状态

- 加载中
- 空状态
- 错误状态
- 就绪
- 搜索中
- 提交中

## 弹窗状态

- 新增弹窗
- 编辑弹窗
- 提交中
- 提交失败

## 组件

### UserManagementPage

- 角色：页面容器
- 职责：
- 组织页面布局
- 连接查询和 mutation
- 处理权限显隐
- 禁止：
- 承载复杂表单字段实现

### UserTable

- 角色：展示组件
- 职责：
- 展示用户列表
- 展示编辑入口
- 展示空状态
- 禁止：
- 直接请求 API

### UserFormModal

- 角色：表单弹窗
- 职责：
- 渲染新增和编辑表单
- 展示表单校验错误
- 提交失败时保留输入
- 禁止：
- 直接修改全局状态
- 提交失败后清空表单

### data.spec.md

# 数据规格：用户管理

## API 依赖

- `GET /api/users`：listUsers（待确认）
- `POST /api/users`：createUser（待确认）
- `PUT /api/users/:id`：updateUser（待确认）

## 状态归属

- 服务端状态：用户列表、分页信息和提交结果由接口层管理。
- 表单状态：新增和编辑表单状态由表单组件管理。
- URL 状态：搜索关键词和页码可进入 URL query。
- 权限状态：权限状态由项目既有权限模块提供。

## 权限

- `user:read`：查看用户列表
- `user:create`：新增用户
- `user:update`：编辑用户

## 失败策略

- submitFailed: preserve-input-and-show-error

### behavior.spec.md

# 行为规格：用户管理

## 用户行为

### 搜索用户

触发：用户提交搜索条件

步骤：
- 更新搜索关键词
- 页码重置为 1
- 重新请求用户列表

### 新增用户失败

触发：新增表单提交失败

步骤：
- 保持弹窗打开
- 保留用户输入
- 展示提交错误

### 编辑用户失败

触发：编辑表单提交失败

步骤：
- 保持弹窗打开
- 保留用户输入
- 展示提交错误

## 验收标准

- 首次进入页面展示加载状态
- 无数据时展示空状态
- 接口失败时展示错误状态
- 搜索后页码重置为 1
- 新增失败时保留用户输入
- 编辑失败时保留用户输入
- 无新增权限时隐藏新增入口
- 无编辑权限时隐藏编辑入口

### verify.spec.md

# 验证规格：用户管理

## 必需检查

- typecheck
- lint
- build

## 验收测试

- 覆盖加载、空态、错误态
- 覆盖提交失败保留输入
- 覆盖权限显隐

## 架构检查

- 展示组件不能直接请求 API
- 表单组件不能在失败时重置输入

### plan.md

# 实施方案：user-management

## 摘要

基于现有项目结构实现用户管理页面，先建立 API 与查询层，再实现页面容器、表格、表单弹窗和验证。

## 创建文件

- src/features/user-management/api.ts
- src/features/user-management/queries.ts
- src/features/user-management/UserManagementPage.tsx
- src/features/user-management/components/UserTable.tsx
- src/features/user-management/components/UserFormModal.tsx

## 修改文件

- src/routes 或现有路由入口

## 组件树

UserManagementPage -> UserTable + UserFormModal

## 数据流

页面容器读取 URL/query 状态，查询层请求用户列表，mutation 成功后刷新列表。

## 状态归属

- 服务端状态归 React Query 或项目既有查询层
- 表单状态归 UserFormModal
- 权限状态归项目既有权限模块

## 风险

- 真实 API 字段未确认
- 权限模块位置未确认

## 必须遵守的规则

- 展示组件不能直接请求 API
- 提交失败时必须保留用户输入
- 不要重构无关文件

### tasks.md

# 任务清单：user-management

## 1. 建立数据层

定义用户列表、新增和编辑的类型与 API 函数。

- [ ] 新增 API 类型
- [ ] 实现 listUsers/createUser/updateUser
- [ ] 实现查询和 mutation hooks

## 2. 实现页面 UI

实现列表、搜索、分页和新增/编辑入口。

- [ ] 实现页面容器
- [ ] 实现 UserTable
- [ ] 实现 UserFormModal
- [ ] 覆盖加载/空态/错误态

## 3. 补充验证

补充关键行为测试并运行验证命令。

- [ ] 测试提交失败保留输入
- [ ] 测试权限显隐
- [ ] 运行 ai-fe verify

## 完成后请汇报

- 创建了哪些文件
- 修改了哪些文件
- 完成了哪些任务
- 做了哪些假设
- 还有哪些未解决问题
- 建议执行哪些验证命令
