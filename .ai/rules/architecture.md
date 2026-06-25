# 架构规则

- 路由级组合逻辑应靠近 routes/pages。
- 可复用 UI 应放在 shared components 中。
- 除非依赖被明确抽为共享模块，否则避免跨 feature import。
