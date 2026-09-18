# Tm 子组件与「子组件写法」指南

> 本文件是 `prefer-tm-ui` skill 的参考资料。当你要写 `<tm-select><tm-select-option/>…`、`<tm-tree><tm-tree-node/>…`
> 这类**模板子组件**，或要用 `TmTableColumn` / `TmRadioButton` / `TmCompact` 这类**配套件**时，先读本文件。
> 组件总清单见 `component-list.md`。

## 一条总原则

**能用配置驱动就不要用模板子组件。** 同一能力组件库通常给了两种写法：

| 写法 | 形态 | 建议 |
| --- | --- | --- |
| 配置驱动（推荐） | `<tm-select :options="list" />`、`<tm-tree :tree-data="tree" />`、`<tm-timeline :items="rows" />` | 类型提示完整、动态数据无需拼模板、不受下述陷阱影响 |
| 模板子组件 | `<tm-select><tm-select-option/></tm-select>` | 只在选项**静态且数量少**、或需要子项级自定义插槽时用 |

两种写法产物等价；一旦选了模板写法，就必须遵守本文件的陷阱条款。

> 模板里的属性与事件**一律 kebab-case**（`:value-format` / `v-model:checked-keys` / `@press-enter`），
> 插槽名例外（`#bodyCell` 保持 ant 原样）。完整约定见 SKILL.md §3「模板写法约定」。

## Tm 子组件的四类实现（决定了谁安全、谁有坑）

组件库为「Tm 前缀一致性」补齐了 ant 的命名空间子组件，实现分四类，**行为差异全部来自实现机制**：

| 类 | 机制 | 成员 | 模板子组件写法可用？ |
| --- | --- | --- | --- |
| **A. 父容器按 vnode 识别** | 父容器读子 vnode（type 与 props）生成内部数据 | `TmSelectOption` / `TmSelectOptGroup` / `TmAutoCompleteOption` / `TmAutoCompleteOptGroup` / `TmTreeNode` / `TmTreeSelectNode` / `TmTimelineItem` / `TmMentionsOption` / `TmMenuItem` 系 / `TmBreadcrumbItem` / `TmStep` / `TmTabPane` / `TmCollapsePanel` / `TmDescriptionsItem` / `TmListItem` 系 | ✅ 经过 Tm 封装转发仍可识别（陷阱见下） |
| **B. 父容器靠 provide/inject** | 父容器 provide，子件 inject 取上下文 | `TmRadio` / `TmRadioButton` / `TmCheckbox` 作为 **Group 的子节点**时 | ❌ **经 Tm 容器转发会断链**——Vue 的 slot 内容 parent 指向转发组件而非挂载位置，inject 取不到 provide |
| **C. 别名复用** | `withInstall` 把 ant 原组件对象**原样**附加 install 后返回同一引用 | `TmTableColumn` 五件套 / `TmCardGrid` / `TmCardMeta` / `TmBadgeRibbon` / `TmButtonGroup` / `TmInputGroup` / `TmCompact` / `TmFormItemRest` / `TmSkeletonTitle` / `TmTreeNode` / `TmTimelineItem` | ✅ 与 ant 原生写法逐字节一致（vnode.type 全等） |
| **D. 本地包装件** | 多为 `components/<x>/src/<Y>.vue`，仅转发 slot / props 到 ant 子组件 | `TmBreadcrumbItem` / `TmStep` / `TmTabPane` / `TmCollapsePanel` / `TmDescriptionsItem` / `TmListItem` 系 / `TmAvatarGroup` / `TmCountdown` / `TmFloatButtonGroup` 等 | ⚠️ 可用性**由父容器机制决定**：父走 A 类 vnode 识别 → 可用；父走 B 类 provide/inject → 断链 |

> 判断技巧：**先看父容器怎么找子件**——找的是「子 vnode」（A，包装件随便套）还是「inject 的上下文」（B，必须原生容器）。再看子件本身是不是 ant 原对象（C，零风险）。
>
> 注：A 与 D 经常同时成立（子件是 D 类包装件，父容器是 A 类识别机制），此时模板写法可用。

## 实测陷阱（每条都验证过，别凭直觉绕）

### 1. 空数组 `:options="[]"` 会关掉模板子组件模式

ant 的判定是 `childrenAsData = !options && children`——**空数组是 truthy**，所以 `:options="[]"` 会让容器走「配置驱动」分支，模板子组件被无视，结果是**下拉框回显原始 value 而不是选项文本**。

```vue
<!-- ❌ 下拉会显示 apple 而不是「苹果」 -->
<tm-select v-model="fruit" :options="[]">
  <tm-select-option value="apple">苹果</tm-select-option>
</tm-select>

<!-- ✅ 要用模板写法就彻底不传 options -->
<tm-select v-model="fruit">
  <tm-select-option value="apple">苹果</tm-select-option>
</tm-select>
```

同一陷阱在 ant Table 上表现为**整表渲染成空列**（`columns = props.columns || convertChildrenToColumns(...)`，空数组同样 truthy）。规则：**配置 prop 与模板子组件二选一，绝不同时出现；动态列表要「清空」时改用 `v-if` 切换，不要传空数组。**

### 2. `TmRadioButton` 必须配**原生** `a-radio-group`

`TmRadioGroup` 是 Tm 封装，会转发子节点，而 Radio 系靠 provide/inject 识别子按钮（B 类）——**经 Tm 容器转发会断链，按钮不响应选中**。正确姿势：按钮态单选用原生 RadioGroup 承载 TmRadioButton；若整组都要 Tm 前缀，改用 `TmRadioGroup` 的 `options` prop（配置驱动）。

```vue
<script setup lang="ts">
import { RadioGroup as ARadioGroup } from 'ant-design-vue'  // 原生容器
import { TmRadioButton } from '@trustmo/tm-ui'
</script>

<template>
  <a-radio-group v-model:value="period">
    <tm-radio-button value="year">按年</tm-radio-button>
    <tm-radio-button value="quarter">按季</tm-radio-button>
  </a-radio-group>
</template>
```

同理适用于 `TmCheckbox` 作为 `TmCheckboxGroup` 子节点：**用 `options` prop**。

### 3. `TmMenu` 传了 `items` 后，子组件被整体忽略

ant Menu 的实现是 `itemsNodes || flattenChildren(slots.default)`——`items` 优先，传了它就完全不看子组件。混写的结果是**子组件里的菜单项静默消失**（不报错）。

```vue
<!-- ❌ 「来自子组件」不会渲染 -->
<tm-menu mode="inline" :items="[{ key: 'a', label: '来自 items' }]">
  <tm-menu-item key="b">来自子组件</tm-menu-item>
</tm-menu>
```

### 4. `TmTableColumn` 五件套**只对原生 `<a-table>` 有效**

`TmTable` 是 **vxe-table** 封装，不消费 ant 的模板列子组件；把二者混用会得到空表。用 TmTable 时列一律走 `columns` 数组（vxe 的字段名是 `field`，不是 ant 的 `dataIndex`）。

```vue
<!-- ✅ 模板列五件套：配原生 a-table -->
<a-table :data-source="rows" row-key="id" :pagination="false">
  <tm-table-column data-index="name" title="姓名" key="name" />
  <tm-table-column data-index="status" title="状态" key="status">
    <template #default="{ text }"><a-tag>{{ text }}</a-tag></template>
  </tm-table-column>
</a-table>

<!-- ✅ 业务表格：配 TmTable + columns 数组，不要用 TmTableColumn -->
<tm-table :data="rows" :columns="columns" />
```

### 5. 需要容器「发现」的子项，`key` 必须显式且唯一

`TmMenuItem` / `TmTreeNode` / `TmTreeNode` 等靠 `key` 标识状态（选中、展开、勾选）。缺 key 的典型症状是**多项同时高亮**或展开状态错乱。

```vue
<tm-tree default-expand-all>
  <tm-tree-node key="0-0" title="公司">                     <!-- key 必填 -->
    <tm-tree-node key="0-0-0" title="技术部" />
  </tm-tree-node>
</tm-tree>
```

### 6. `TmMentionsOption` 在 ant 4.2.6 已废弃

仍可用（别名复用，行为一致），但**新代码一律用 `:options`**，否则会打印 ant 的废弃警告。

### 7. Breadcrumb 的 Item 级 `separator` 会被容器覆盖

ant 用 cloneVNode 覆盖子项 separator，所以 `<tm-breadcrumb-item separator=">">` 永远显示默认 `/`。要逐段自定义分隔符，必须**容器 `separator=""` + 显式 `<tm-breadcrumb-separator>`**：

```vue
<tm-breadcrumb separator="">
  <tm-breadcrumb-item>首页</tm-breadcrumb-item>
  <tm-breadcrumb-separator>:</tm-breadcrumb-separator>
  <tm-breadcrumb-item>列表</tm-breadcrumb-item>
</tm-breadcrumb>
```

> 若容器 separator 不是空串，每个子项会各带一个默认分隔符，结果是 `['/', ':', '/']` 这种重复。

### 8. `TmFormItemRest`：一个表单项里要放多个控件时用它

它阻断 `TmFormItem` 对子级控件的样式与校验注入。**一个 FormItem 只放一个受控控件**是 ant 的默认预期；要放多个（例如拼接的输入组合）就必须用 `TmFormItemRest` 包住多余的控件，否则校验绑定与间距都会错位。

## 全量子组件对照表

| Tm 子组件 | 对应 ant | 宿主容器 | 类 |
| --- | --- | --- | --- |
| `TmSelectOption` | Select.Option | `TmSelect` | A |
| `TmSelectOptGroup` | Select.OptGroup | `TmSelect` | A |
| `TmAutoCompleteOption` | AutoComplete.Option | `TmAutoComplete` | A |
| `TmAutoCompleteOptGroup` | AutoComplete.OptGroup | `TmAutoComplete` | A |
| `TmTreeNode` | Tree.TreeNode | `TmTree` / `TmDirectoryTree` | A |
| `TmTreeSelectNode` | TreeSelect.TreeNode | `TmTreeSelect` | A |
| `TmTimelineItem` | Timeline.Item | `TmTimeline` | A |
| `TmMentionsOption` | Mentions.Option | `TmMentions` | A（4.2.6 已废弃，改用 `:options`） |
| `TmMenuItem` / `TmSubMenu` / `TmMenuItemGroup` / `TmMenuDivider` | Menu.Item / SubMenu / ItemGroup / Divider | `TmMenu` | A（但不能与 `items` 同时用） |
| `TmBreadcrumbItem` / `TmBreadcrumbSeparator` | Breadcrumb.Item / Separator | `TmBreadcrumb` | A |
| `TmStep` | Steps.Step | `TmSteps` | A |
| `TmTabPane` | Tabs.TabPane | `TmTabs` | A |
| `TmCollapsePanel` | Collapse.Panel | `TmCollapse` | A |
| `TmDescriptionsItem` | Descriptions.Item | `TmDescriptions` | A |
| `TmListItem` / `TmListItemMeta` | List.Item / List.Item.Meta | `TmList` | A |
| `TmRadioButton` | Radio.Button | **原生 `a-radio-group`** | B |
| `TmTableColumn` / `TmTableColumnGroup` | Table.Column / ColumnGroup | **原生 `a-table`** | C |
| `TmTableSummary` / `TmTableSummaryRow` / `TmTableSummaryCell` | Table.Summary 系 | **原生 `a-table`** | C |
| `TmCardGrid` / `TmCardMeta` | Card.Grid / Card.Meta | `TmCard` | C |
| `TmBadgeRibbon` | Badge.Ribbon | 任意内容（包裹即可） | C |
| `TmButtonGroup` | Button.Group | `TmButton` 们 | C |
| `TmInputGroup` | Input.Group | 多个输入类控件 | C |
| `TmCompact` | Space.Compact | 任意控件 | C |
| `TmFormItemRest` | Form.Item 内的不受控容器 | `TmFormItem` | C |
| `TmSkeletonTitle` | Skeleton.Title | `TmSkeleton` | C |
| `TmAvatarGroup` / `TmImagePreviewGroup` / `TmFloatButtonGroup` / `TmFloatButtonBackTop` / `TmCountdown` | ant 同名子组件 | 各自父容器 | D（包装件，嵌套即用，无需父容器识别） |

## 排查清单（子组件不生效时按序查）

1. **同时传了配置 prop？** `options` / `items` / `columns` 与模板子组件**二选一**，空数组也算「传了」
2. **容器选错了？** `TmRadioButton` 配原生 `a-radio-group`；`TmTableColumn` 配原生 `a-table`
3. **子项缺 `key`？** 需要被发现的子项（菜单项、树节点）必须显式唯一 key
4. **该用配置驱动？** 动态列表、几十上百条数据——换回 `:options` / `:tree-data` / `:items`
5. **实在要全覆盖 Tm 前缀**：B 类场景改配置驱动（`TmRadioGroup` 的 `options`），不要试图用 Tm 容器转发
