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