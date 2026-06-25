# Verify Report: user-management

Status: passed

## Checks

| Check | Required | Result | Command |
|---|---:|---|---|
| typecheck | true | passed | `npm run typecheck` |
| lint | true | passed | `npm run lint` |
| test | false | passed | `npm test` |
| build | true | passed | `npm run build` |

## Output

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

OK   node
OK   typescript compiler
OK   package.json
OK   .ai/config.json
OK   verification/config.json

npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```

### build

```text
> ai-fe@0.1.0 build
> tsc -p tsconfig.json


npm warn Unknown user config "home". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
```
