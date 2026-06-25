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