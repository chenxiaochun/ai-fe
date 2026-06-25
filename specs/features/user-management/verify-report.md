# 验证报告：user-management

## 总览

状态：通过

## 检查结果

| 检查项 | 是否必需 | 结果 | 耗时 |
|---|---:|---|---:|
| typecheck | 是 | 通过 | 0.4s |
| lint | 是 | 通过 | 0.3s |
| test | 否 | 通过 | 0.3s |
| build | 是 | 通过 | 0.3s |

## 详细输出

### typecheck

执行命令：

```bash
npm run typecheck
```

输出：

```text
> ai-fe@0.1.0 typecheck
> tsc -p tsconfig.json --noEmit


npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

### lint

执行命令：

```bash
npm run lint
```

输出：

```text
> ai-fe@0.1.0 lint
> tsc -p tsconfig.json --noEmit


npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

### test

执行命令：

```bash
npm run test
```

输出：

```text
> ai-fe@0.1.0 test
> node dist/cli.js doctor

ai-fe 项目检查

✓ 已找到 node
✓ 已找到 TypeScript 编译器
✓ 已找到 package.json
✓ 已找到 .ai/config.json
✓ 已找到 .ai/state.json
✓ feature-spec.schema.json 已生成
✓ plan.schema.json 已生成
✓ 已找到 specs/features
✓ 已找到 verification/config.json
✓ build 命令已配置
✓ lint 命令已配置
✓ typecheck 命令已配置
✓ test 命令已配置

npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

### build

执行命令：

```bash
npm run build
```

输出：

```text
> ai-fe@0.1.0 build
> tsc -p tsconfig.json


npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```
