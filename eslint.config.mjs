// 根 Flat Config（ESLint 10）—— 全仓单一 lint 配置源。
//
// 历史：apps/demo 曾持有独立 eslint.config.mjs；为避免双配置漂移，
// 现将规则集上移至根，apps/demo 的配置改为 re-export 本文件（单点维护）。
//
// 结构：用 @vue/eslint-config-typescript 的 withVueTs 组合 Vue + TypeScript 规则集，
// 格式化交给独立 prettier（skip-formatting 只关闭冲突规则，不把 prettier 当 eslint 规则跑）。
import pluginVue from 'eslint-plugin-vue';
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default withVueTs(
  // Flat Config 默认只忽略 node_modules；构建产物与生成文件必须显式忽略。
  // 注意：模式相对配置文件所在目录（仓库根），用 ** 匹配任意深度的产物目录。
  {
    name: 'tm/ignores',
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/public/**',
      '**/coverage/**',
      // @kibus/tm-ui-plus 构建产物（es ESM / lib CJS）与 dts 输出
      '**/es/**',
      '**/lib/**',
      // VitePress 缓存与站点产物
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      // unplugin-vue-components 自动生成的组件类型声明
      '**/auto-components.d.ts',
      // 脚手架 dry-run 输出等临时目录
      '**/tmp/**',
    ],
  },
  // Vue 3 推荐规则集（v10 flat 命名：flat/recommended，等价于旧 vue3-recommended）。
  pluginVue.configs['flat/recommended'],
  // TypeScript 推荐规则集（typescript-eslint v8，已适配 .vue 分块解析）。
  vueTsConfigs.recommended,
  // 项目自定义规则。
  {
    name: 'tm/custom-rules',
    rules: {
      'vue/multi-word-component-names': 'off',
      // 下划线前缀的参数/变量/catch 绑定视为故意未使用（社区约定），不报错。
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // 模板既有 any 多为 echarts/vxe-table 等第三方复杂类型包装，降级为 warn 不阻断；
      // 新增 any 仍会被提示。后续作为「类型债清理」专项单独处理。
      '@typescript-eslint/no-explicit-any': 'warn',
      // 类型化 defineProps<TmXxxProps>() 场景下 require-default-prop / require-prop-types
      // 是规则误报：薄封装组件的 props 大多来自 ant 原生类型（可选 prop 由 ant 内部兜底），
      // 无「显式默认值」是设计语义而非遗漏；强行补默认值反而破坏透传。
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
    },
  },
  // 测试文件常定义多个局部组件作为测试用例，one-component-per-file 不适用。
  {
    name: 'tm/spec-overrides',
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
  // 放最后：关闭与 prettier 冲突的规则（prettier/prettier: off）。
  skipFormatting,
);
