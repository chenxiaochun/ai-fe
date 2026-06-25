# Changesets

本目录用于记录每次发布的版本变更。

## 工作流

1. 开发完成后，记录本次变更：

```bash
npm run changeset
```

按提示选择 major / minor / patch，并填写变更说明。

2. 合并变更并提升版本号（会更新 `package.json` 和 `CHANGELOG.md`）：

```bash
npm run version
```

3. 发布到 npm：

```bash
npm login
npm run release
```

`release` 会先执行 `build`，再调用 `changeset publish` 发布到 npm。
