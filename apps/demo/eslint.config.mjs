// Demo 应用 lint 配置：直接复用仓库根配置（单点维护，避免双配置漂移）。
// 根配置覆盖全仓（packages/ui + apps/*），规则见 ../../eslint.config.mjs。
export { default } from '../../eslint.config.mjs';

