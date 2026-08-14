// packages/ui/vite.config.ts
// @kibus/tm-ui-plus 子包的 Vite library mode 构建配置
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
import { readFileSync, writeFileSync } from 'node:fs'

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
      // 产出 dist/index.d.ts + dist/components/table/index.d.ts（与 build js 路径对齐）
      entryRoot: 'src',
      // outDir：与 ESM 输出目录一致，types 与 js 同目录便于 moduleResolution
      outDir: 'dist',
      // cleanVueFileName：把 .vue.d.ts 简化为 .d.ts（vite-plugin-dts 4.5.x API 已核实）
      cleanVueFileName: true,
      // staticImport：把 emit 出的 dynamic import() 类型表达式（如 `import('vue').DefineComponent`）
      // 转换为 static import（`import { DefineComponent } from 'vue'`），让 TS 在 dts 中用包名而非
      // 物理路径。配合 pathsToAliases（默认 true）进一步把 tsconfig paths 反向替换为包名。
      // T14 收口 1a：消除 dts 中残留的 `import('../../../node_modules/X')` 相对路径，保证可移植。
      staticImport: true,
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
          'vue-types/*': [resolve(__dirname, 'node_modules/vue-types/*')],
          'scroll-into-view-if-needed': [
            resolve(__dirname, 'node_modules/scroll-into-view-if-needed'),
          ],
          'scroll-into-view-if-needed/*': [
            resolve(__dirname, 'node_modules/scroll-into-view-if-needed/*'),
          ],
          'vxe-pc-ui': [resolve(__dirname, 'node_modules/vxe-pc-ui')],
          'vxe-pc-ui/*': [resolve(__dirname, 'node_modules/vxe-pc-ui/*')],
          'csstype': [resolve(__dirname, 'node_modules/csstype')],
          'csstype/*': [resolve(__dirname, 'node_modules/csstype/*')],
        },
      },
      // afterBuild 后处理：把 emit 残留的相对 node_modules 路径 normalize 为包名。
      //
      // 背景与决策（T14 收口 1a）：
      // 即使配置 paths `/*` 通配符 + staticImport + pathsToAliases，vite-plugin-dts 4.5.x 仍会把
      // ant-design-vue 传递依赖（vue-types / scroll-into-view-if-needed）的 inline 类型表达式 emit 为
      // `import { VueTypeDef } from '../../../node_modules/vue-types/dist'`（相对路径）——这是 TS 声明
      // emit 的「类型溯源」固性行为：当类型是从其他模块的导出推断而来（源码未显式 import），
      // TS 用类型的物理定义位置（vue-types/dist/index.d.ts）而非包名。
      //
      // 残留影响评估：vue-types 与 scroll-into-view-if-needed 均为 ant-design-vue 的 dependencies
      // （已核实 ant-design-vue package.json），而 ant-design-vue 是本包 peerDependencies——业务方
      // 必装 ant-design-vue，必然传递安装 vue-types / scroll-into-view-if-needed，残留路径**实际可解析**。
      // 但为了「0 残留」的彻底可移植性（避免 pnpm strict 隔离 / npm hoist 异常下的解析失败），
      // 这里统一把 `relative/node_modules/PKG/sub` 替换为 `PKG/sub`（Node ESM 标准模块标识符）。
      //
      // 实现：遍历 afterBuild 入参 emittedFiles（Map<path, content>），命中 node_modules 的文件
      // 直接读盘 → 正则替换 → 写盘。正则只匹配 import 语句中的相对 node_modules 路径，
      // 保留包名（含 @scope）与子路径，符合 Node ESM resolution。
      afterBuild: (emittedFiles) => {
        // 第一步：消除相对 node_modules 路径。
        // 正则解释：
        //   (?:\.\.\/)+               —— 1 个或多个 `../`（emit 出的相对前缀）
        //   node_modules\/            —— 字面量
        //   (@?[^'"]+?)               —— 包名（@scope 可选，非引号字符非贪婪）
        // 保留 `@scope/name[/sub...]` 作为模块标识符。
        // 注：仅替换 import/export 语句中的路径字符串，避免误伤注释/字符串字面量。
        const normalizeRelNodeModules = (content: string): string =>
          content
            .replace(
              /from\s+(['"])(?:\.\.\/)+node_modules\/([^'"]+)\1/g,
              (_m, q, pkg) => `from ${q}${pkg}${q}`,
            )
            .replace(
              /import\((['"])(?:\.\.\/)+node_modules\/([^'"]+)\1\)/g,
              (_m, q, pkg) => `import(${q}${pkg}${q})`,
            )

        // 第二步：把 ant-design-vue / vxe-table 传递依赖的子路径归一化到包根。
        // 已核实三者的 package.json `types`/`typings` 字段均指向与子路径相同的 dts 入口：
        //   - vue-types:                        types: dist/index.d.ts       （dist/index.d.ts 等价于包根）
        //   - scroll-into-view-if-needed:        typings: ./typings/index.d.ts（包根 exports['.'] 的 types 也指向此文件）
        //   - vxe-pc-ui:                         typings: types/index.d.ts    （types/index.d.ts 等价于包根）
        // 故 `PKG/sub` 与 `PKG` 在类型层面完全等价；归一化到包根避免子路径在 Node16/Bundler 严格模式 +
        // exports 字段限制下被拒（scroll-into-view-if-needed 的 exports 仅暴露 '.'）。
        const SUBPATH_TO_ROOT: Array<[RegExp, string]> = [
          [/^vue-types\/dist$/, 'vue-types'],
          [/^scroll-into-view-if-needed\/typings$/, 'scroll-into-view-if-needed'],
          [/^vxe-pc-ui\/types$/, 'vxe-pc-ui'],
        ]
        const normalizeSubpathToRoot = (content: string): string =>
          content
            .replace(
              /from\s+(['"])([^'"]+)\1/g,
              (_m, q, pkg) => {
                const target = SUBPATH_TO_ROOT.find(([re]) => re.test(pkg))
                return target ? `from ${q}${target[1]}${q}` : _m
              },
            )
            .replace(
              /import\((['"])([^'"]+)\1\)/g,
              (_m, q, pkg) => {
                const target = SUBPATH_TO_ROOT.find(([re]) => re.test(pkg))
                return target ? `import(${q}${target[1]}${q})` : _m
              },
            )

        for (const filePath of emittedFiles.keys()) {
          // 仅处理 .d.ts 文件（emittedFiles 可能含其它产物）
          if (!filePath.endsWith('.d.ts')) continue
          const original = readFileSync(filePath, 'utf8')
          const normalized = normalizeSubpathToRoot(normalizeRelNodeModules(original))
          if (normalized !== original) {
            writeFileSync(filePath, normalized, 'utf8')
          }
        }
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
        // ESM 产物：写入 dist/，扩展名 .js
        // chunkFileNames 用 chunks/ 子目录 + 含 hash，隔离共享 chunk 与业务入口，避免 hash 变更污染 git diff
        // exports:'named' 明确声明「以 named export 为主」，消除 rollup MIXED_EXPORTS 警告
        {
          format: 'es',
          dir: 'dist',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          exports: 'named',
        },
        // CJS 产物：写入 dist/，扩展名 .cjs（与 ESM .js 区分，统一单目录）
        {
          format: 'cjs',
          dir: 'dist',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          exports: 'named',
        },
      ],
    },
  },
})
