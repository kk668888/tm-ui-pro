// packages/ui/vite.config.ts
// @tm/ui 子包的 Vite library mode 构建配置
//
// 核心目标（M4 构建三件套协同要求）：
//   build 产物路径 ↔ package.json exports 路径 ↔ dts 类型路径 三者必须对齐。
//   本任务先用「策略 A」固化 build 产物路径结构，Task 14 据此校对 exports。
//
// 策略 A（entry key 镜像 src 路径，brief Bug 1 推荐方案）：
//   - entry key 'index'                 → 产物 es/index.js / lib/index.cjs
//   - entry key 'components/table/index' → 产物 es/components/table/index.js / lib/components/table/index.cjs
//   - dts（entryRoot:'src'）天然镜像 src 结构 → es/index.d.ts + es/components/table/index.d.ts
//   三者路径完全一致，exports 可直接指向 es/components/table/index.{js,d.ts}。
//
// 关键决策：
// 1. peerDeps 6 项全部 external，不打包（vue / ant-design-vue / @ant-design/icons-vue /
//    vxe-table / vxe-pc-ui / @vxe-ui/core）——业务侧自重，包体积最小。
// 2. 多 format 输出：es（ESM, .js）+ lib（CJS, .cjs）双目录，由 rollupOptions.output 数组驱动。
//    注意：在自定义 output 数组时，移除 lib.fileName 避免与 output.entryFileNames 冲突（brief Bug 2）。
// 3. dts 插件：仅对 src 下业务代码生成 .d.ts，剔除 spec / demos / test setup 等噪声
//    （brief Bug 4：cleanVueFileName 在 vite-plugin-dts 4.5.x 仍存在，已核实 API）。
// 4. __dirname 兼容：vite 加载配置经 esbuild 转译，`__dirname` 在 Windows + ESM 边界
//    通常可用，但稳妥起见用 fileURLToPath(import.meta.url) 显式构造（brief Bug 6）。
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// ESM 下显式构造 __dirname，避免 Windows + ESM 边界的潜在不一致（brief Bug 6）
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// peerDeps 全部 external：构建产物不打包这些依赖，由业务侧自行提供
const PEER_EXTERNAL = [
  'vue',
  'ant-design-vue',
  '@ant-design/icons-vue',
  'vxe-table',
  'vxe-pc-ui',
  '@vxe-ui/core',
] as const

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // entryRoot：声明 src 为类型根，让 .d.ts 镜像 src 目录结构
      // 产出 es/index.d.ts + es/components/table/index.d.ts（与 build js 路径对齐）
      entryRoot: 'src',
      // outDir：与 ESM 输出目录一致，types 与 js 同目录便于 moduleResolution
      outDir: 'es',
      // cleanVueFileName：把 .vue.d.ts 简化为 .d.ts（vite-plugin-dts 4.5.x API 已核实）
      cleanVueFileName: true,
      // 显式指定 tsconfig 路径，确保 dts 用 packages/ui/tsconfig.json 解析（brief Bug 4）
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      // 仅对业务源码生成类型；剔除测试、demo、全局 setup 等非发布文件
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/__tests__/**',
        'src/**/demos/**',
        'src/test/**',
      ],
      // TS2742 portability 修复：pnpm strict 隔离下，ant-design-vue 内部依赖（vue-types /
      // scroll-into-view-if-needed）与 vxe-pc-ui 的深度推断类型会被 TS 烘焙成 .pnpm/... 虚拟
      // 存储路径，导致 .d.ts 不可移植。用 compilerOptions.paths 把这些传递依赖统一映射到
      // packages/ui 的本地 node_modules 公共路径，强制 TS 用包名而非虚拟路径生成 import() 表达式。
      compilerOptions: {
        paths: {
          'vue-types': [resolve(__dirname, 'node_modules/vue-types')],
          'scroll-into-view-if-needed': [
            resolve(__dirname, 'node_modules/scroll-into-view-if-needed'),
          ],
          'vxe-pc-ui': [resolve(__dirname, 'node_modules/vxe-pc-ui')],
        },
      },
    }),
  ],
  build: {
    lib: {
      // 策略 A：entry key 镜像 src 路径，确保 es/lib 产物路径与 dts/exports 对齐（brief Bug 1）
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'components/table/index': resolve(__dirname, 'src/components/table/index.ts'),
      },
      // 不设 lib.fileName：多 format + 多 entry 下用 rollupOptions.output.entryFileNames 驱动
      // 命名规则（brief Bug 2：避免与 output 数组的 entryFileNames 冲突）
    },
    rollupOptions: {
      // peerDeps 全部 external：业务侧自重，构建产物不含 vue/ant/vxe
      external: [...PEER_EXTERNAL],
      output: [
        // ESM 产物：写入 es/，扩展名 .js
        // chunkFileNames 用 chunks/ 子目录 + 含 hash，隔离共享 chunk 与业务入口，避免 hash 变更污染 git diff
        // exports:'named' 明确声明「以 named export 为主」，消除 rollup MIXED_EXPORTS 警告
        {
          format: 'es',
          dir: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          exports: 'named',
        },
        // CJS 产物：写入 lib/，扩展名 .cjs（区分 Node require 解析）
        {
          format: 'cjs',
          dir: 'lib',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          exports: 'named',
        },
      ],
    },
  },
})
