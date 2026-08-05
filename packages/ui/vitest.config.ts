// packages/ui/vitest.config.ts
// @tm/ui 子包的 Vitest 最小配置
// Task 12 将在此基础上补充 coverage / alias 等增强项，届时合并即可
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 启用 Vue SFC 编译支持（便于后续直接测试 .vue 组件）
  plugins: [vue()],
  test: {
    // jsdom 提供 DOM 环境（组件挂载、app.component 注册等需要 window/document）
    environment: 'jsdom',
    // 开启 globals：测试中可直接使用 describe/it/expect 而无需 import
    globals: true,
  },
})
