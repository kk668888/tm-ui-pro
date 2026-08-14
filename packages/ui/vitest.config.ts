// packages/ui/vitest.config.ts
// @kibus/tm-ui-plus 子包的 Vitest 完整配置（Task 12 在 Task 4 最小版上合并 coverage + 全局 polyfill）
//
// 关键升级（覆盖 Task 4 最小版）：
// 1. coverage：v8 provider，text + html reporter；include 业务源码，剔除 spec/demos/setup
//    —— 满足 Global Constraints 的 ≥80% 覆盖率要求。
// 2. setupFiles：把 Task 10 Form 局部 matchMedia polyfill + Task 11 Table 局部 matchMedia /
//    ResizeObserver polyfill 提升为全局，所有 spec 共享，消除每文件重复补丁（brief Bug 5）。
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Vue SFC 编译支持：直接测试 .vue 组件
  plugins: [vue()],
  test: {
    // jsdom 提供 DOM 环境（组件挂载、app.component 注册等需要 window/document）
    environment: 'jsdom',
    // 开启 globals：测试中可直接使用 describe/it/expect 而无需 import
    globals: true,
    // 全局 setup：所有 spec 共享 matchMedia / ResizeObserver 等 jsdom 缺失 API 补丁
    // 提升 Task 10/11 各自的局部 polyfill，消除重复（brief Bug 5）
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      // v8 provider：开箱即用，性能优于 istanbul
      provider: 'v8',
      // 双 reporter：text 控制台快速反馈 + html 详细可视化
      reporter: ['text', 'html'],
      // 仅统计业务源码（.ts / .vue），不含 spec / demos / 测试 setup
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/__tests__/**',
        'src/**/demos/**',
        'src/test/**',
        'src/**/*.d.ts',
      ],
      // 覆盖率门槛（README 声明 ≥80% 的落地）：低于阈值测试即失败，
      // 防止组件扩展时覆盖率悄悄下滑（2026-08-14 审查收口）。
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
    },
  },
})
