# 验证报告：user-management

状态：通过

## 检查项

| 检查项 | 必需 | 结果 | 命令 |
|---|---:|---|---|
| typecheck | true | 通过 | `npm run typecheck` |
| lint | true | 通过 | `npm run lint` |
| test | false | 通过 | `npm test` |
| build | true | 通过 | `npm run build` |

## 输出

### typecheck

```text
> ai-fe@0.1.0 typecheck
> tsc -p tsconfig.json --noEmit


npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

### lint

```text
> ai-fe@0.1.0 lint
> tsc -p tsconfig.json --noEmit


npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

### test

```text
> ai-fe@0.1.0 test
> node dist/cli.js doctor

通过 node
通过 TypeScript 编译器
通过 package.json
通过 .ai/config.json
通过 verification/config.json

npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

### build

```text
> ai-fe@0.1.0 build
> tsc -p tsconfig.json


npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```
