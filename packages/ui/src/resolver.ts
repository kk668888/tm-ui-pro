// packages/ui/src/resolver.ts
// unplugin-vue-components 按需 Resolver：业务方零配置自动导入 <TmXxx>
//
// 使用方式（业务方 vite.config.ts）：
//   import Components from 'unplugin-vue-components/vite'
//   import { TmResolver } from '@tm/ui'
//   export default defineConfig({
//     plugins: [Components({ resolvers: [TmResolver] })],
//   })
//
// 设计要点：
// 1. 纯函数工厂：每次调用返回独立 ComponentResolver 实例（无共享闭包状态，不可变）。
// 2. 仅识别 Tm 前缀：非 Tm 组件名（ElButton / a-button / 原生标签）一律 undefined，
//    交由其它 resolver 或保持原生行为。
// 3. TmTable 走子入口 @tm/ui/table：vxe-table 体积大，独立 chunk 隔离，按需加载不污染主入口。
// 4. 其余 TmXxx 走主入口 @tm/ui：fail-fast 设计——未实现组件（如 TmXYZ）也返回 @tm/ui，
//    业务侧 vite build 会因 `import { TmXYZ } from '@tm/ui'` 的 named export 缺失立即报错，
//    比白名单静默 undefined 更早暴露错误（brief Bug 5 决策：保留 plan 逻辑）。
// 5. kebab 转换：作为「组件名 → 入口路径」的标准映射保留，未来若 TmSelect 等独立子入口，
//    可直接 `kebab === 'select'` 扩展，无需重构（brief Bug 1 决策：保留扩展预留）。
// unplugin-vue-components 的 ComponentResolver 是 union（函数式 | 对象式），
// 这里固定返回对象式 ComponentResolverObject（含 type + resolve）：
// 1. 让 TS 在调用侧（如测试）直接知道 .resolve 方法存在，无需 type assertion；
// 2. ComponentResolverObject 是 ComponentResolver 的子类型，业务方 `resolvers: [TmResolver]` 仍兼容；
// 3. API 文档更明确——本 Resolver 永远是 object-form。
import type { ComponentResolverObject } from 'unplugin-vue-components'

/**
 * @tm/ui 按需导入 Resolver 工厂
 *
 * @returns unplugin-vue-components 标准 ComponentResolverObject，业务方配 `resolvers: [TmResolver]` 即可
 *
 * 映射约定：
 *   - TmButton / TmInput / TmSelect / TmForm / TmFormItem / TmConfigProvider / ... → from '@tm/ui'
 *   - TmTable → from '@tm/ui/table'（vxe 子入口，体积隔离）
 *   - 非 Tm 前缀 / 仅 'Tm' 前缀无组件名 → undefined（不处理）
 */
export function TmResolver(): ComponentResolverObject {
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

      // TmTable 走子入口 @tm/ui/table（vxe-table 体积大需独立 chunk），其余走主入口 @tm/ui
      // 注：未实现组件（TmXYZ）也命中 '@tm/ui' 分支——fail-fast，业务侧构建期即报错（brief Bug 5 决策）
      const from = kebab === 'table' ? '@tm/ui/table' : '@tm/ui'

      return { name, from }
    },
  }
}
