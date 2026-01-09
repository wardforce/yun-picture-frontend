# CONSENSUS_installation_element_plus_x

## 明确需求

安装 `vue-element-plus-x` 及其依赖项 `element-plus`。

## 技术方案

- 使用 `npm install vue-element-plus-x element-plus --save`。
- 因为目前项目主要使用 `ant-design-vue`，本次安装仅涉及包的引入，不建议立即进行全局样式注入，以免污染现有 UI。

## 验收标准

1. `package.json` 更新。
2. `node_modules` 中存在对应包。
3. 项目 `npm run dev` 能够正常启动。
