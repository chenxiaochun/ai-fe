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