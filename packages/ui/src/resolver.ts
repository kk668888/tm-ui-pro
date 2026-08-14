// packages/ui/src/resolver.ts
// unplugin-vue-components 按需 Resolver：业务方零配置自动导入 <TmXxx>
//
// 使用方式（业务方 vite.config.ts）：
//   import Components from 'unplugin-vue-components/vite'
//   import { TmResolver } from '@kibus/tm-ui-plus'
//   export default defineConfig({
//     plugins: [Components({ resolvers: [TmResolver()] })],
//   })
//
// 设计要点：
// 1. 纯函数工厂：每次调用返回独立 ComponentResolver 实例（无共享闭包状态，不可变）。
// 2. 仅识别 Tm 前缀：非 Tm 组件名（ElButton / a-button / 原生标签）一律 undefined，
//    交由其它 resolver 或保持原生行为。
// 3. TmTable 走子入口 @kibus/tm-ui-plus/table：vxe-table 体积大，独立 chunk 隔离，按需加载不污染主入口。
// 4. 其余 TmXxx 走主入口 @kibus/tm-ui-plus：fail-fast 设计——未实现组件（如 TmXYZ）也返回 @kibus/tm-ui-plus，
//    业务侧 vite build 会因 `import { TmXYZ } from '@kibus/tm-ui-plus'` 的 named export 缺失立即报错，
//    比白名单静默 undefined 更早暴露错误（brief Bug 5 决策：保留 plan 逻辑）。
// 5. kebab 转换：作为「组件名 → 入口路径」的标准映射保留，未来若 TmSelect 等独立子入口，
//    可直接 `kebab === 'select'` 扩展，无需重构（brief Bug 1 决策：保留扩展预留）。
// 6. dts portability（T14 收口 1b）：不直接 `import type { ComponentResolverObject }`
//    —— 实测 vite-plugin-dts 4.5.x emit 时会把「用作返回类型注解的 type-only import」降级为
//    value import（`import { ComponentResolverObject } from 'unplugin-vue-components'`），
//    经 es/index.d.ts 的 `export { TmResolver } from './resolver'` 静态 re-export，
//    会在消费方 skipLibCheck:false 下报 `Cannot find module 'unplugin-vue-components'`。
//    改用本地结构性等价类型 TmComponentResolverObject（脱钩传递依赖）：
//    a. 与 unplugin-vue-components 的 ComponentResolverObject 结构等价（type + resolve）；
//    b. resolve 返回类型用最小形状 { name; from }，兼容 ComponentResolveResult
//       （ComponentInfo 的必填字段仅 from，name 是 optional，结构子类型兼容）；
//    c. 业务方 `Components({resolvers:[TmResolver()]})` 在结构子类型规则下仍接受——
//       消费方自行装 unplugin-vue-components（用 Components 的前提），类型解析在消费侧完成。

/**
 * 本地结构性等价类型（脱钩 unplugin-vue-components 强制依赖，保证 dts 可移植）
 *
 * 与 unplugin-vue-components 的 ComponentResolverObject 等价：
 *   interface ComponentResolverObject {
 *     type: 'component' | 'directive'
 *     resolve: (name: string) => ComponentResolveResult
 *   }
 *
 * TmResolver() 永远返回 type:'component'，resolve 返回 { name, from } | undefined。
 */
interface TmComponentResolverObject {
  /** Resolver 类型：本工厂固定为 'component'（与 unplugin-vue-components 的对象式 Resolver 一致） */
  type: 'component' | 'directive'
  /** 解析函数：组件名 → { name, from }（命中则返回，否则 undefined 交还其它 resolver） */
  resolve: (name: string) => { name: string; from: string } | undefined
}

/**
 * @kibus/tm-ui-plus 按需导入 Resolver 工厂
 *
 * @returns 结构性兼容 unplugin-vue-components ComponentResolverObject 的对象，
 *          业务方配 `resolvers: [TmResolver()]` 即可
 *
 * 映射约定：
 *   - TmButton / TmInput / TmSelect / TmForm / TmFormItem / TmConfigProvider / ... → from '@kibus/tm-ui-plus'
 *   - TmTable → from '@kibus/tm-ui-plus/table'（vxe 子入口，体积隔离）
 *   - 非 Tm 前缀 / 仅 'Tm' 前缀无组件名 → undefined（不处理）
 */
export function TmResolver(): TmComponentResolverObject {
  return {
    type: 'component',
    resolve: (name: string) => {
      // 仅处理 Tm 前缀组件名（非 Tm 前缀返回 undefined，交由其它 resolver 或保持原生标签）
      if (!name.startsWith('Tm')) return

      // 去前缀：TmButton → Button，TmTable → Table，Tm → ''
      const partial = name.slice(2)

      // 边界：仅前缀 'Tm'（无组件名）→ undefined，避免对无意义标签 <Tm> 误匹配
      if (partial.length === 0) return

      // kebab-case 转换：Button → button，FormItem → form-item，ConfigProvider → config-provider
      // replace 在每个大写字母前插 '-'，首字符也会变 '-b'，故 slice(1) 去掉开头的 '-'
      // 保留 kebab 作为「组件名 → 入口路径」标准映射，便于未来扩展独立子入口（brief Bug 1 决策）
      const kebab = partial
        .replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
        .slice(1)

      // TmTable 走子入口 @kibus/tm-ui-plus/table（vxe-table 体积大需独立 chunk），其余走主入口 @kibus/tm-ui-plus
      // 注：未实现组件（TmXYZ）也命中 '@kibus/tm-ui-plus' 分支——fail-fast，业务侧构建期即报错（brief Bug 5 决策）
      const from = kebab === 'table' ? '@kibus/tm-ui-plus/table' : '@kibus/tm-ui-plus'

      return { name, from }
    },
  }
}
