## 1. 准备

- [x] 1.1 确认缺口清单（40 组件分类归位）与 demo mock/请求层可复用，阅读现有 section 结构作为模板

## 2. General section 补全（14 组件）

- [x] 2.1 补 Breadcrumb / Dropdown / Menu / Pagination / Steps / Tabs：基础用法演示（锚点交互、菜单项、分页切换）
- [x] 2.2 补 Affix / Anchor / PageHeader / Divider / Flex / Space / Layout(含 Row/Col)：布局与导航类基础陈列

## 3. DataDisplay section 补全（14 组件）

- [x] 3.1 补 Avatar / Badge(已有) / Calendar / Card / Carousel / Collapse / Descriptions / Image：信息展示类基础演示
- [x] 3.2 补 List / QRCode / Segmented / Statistic / Timeline / Tooltip / Comment：列表与辅助类基础演示

## 4. Form section 补全（8 组件）+ 交互

- [x] 4.1 补 AutoComplete / Checkbox(单) / Mentions / Radio(单) / Rate / Slider / Transfer / Tree：表单输入类基础演示
- [x] 4.2 Select 交互增强：远程搜索演示（`:remote` 驱动，mock /api/users 按 name 过滤）

## 5. Feedback section 补全（3 组件）+ 交互

- [x] 5.1 补 Progress（业务 status 四态映射 + 动态百分比）/ Skeleton（加载态切换）/ Tour（步骤引导，v-model:open 自闭合）
- [x] 5.2 DatePicker valueFormat 字符串桥接示例（Form.section 既有 value-format 演示，已覆盖）

## 6. 核心交互示例

- [x] 6.1 Table 远程分页 / 搜索 / 密度切换：复用 mock /api/users，TmTable `:request` + `:search` + `:density` 三档切换
- [x] 6.2 Form 校验 / 字段联动 / 提交反馈：rules 校验、部门选择联动禁用账户输入、@finish 提交 + TmMessage 反馈

## 7. 测试与验证

- [x] 7.1 为各 section 新增演示块补 `*.section.spec.ts` 断言（挂载 + 关键 props 生效 + 交互状态）
- [x] 7.2 运行 demo 测试（tm-components 12 全过；demo 全量 217/218，1 个 router.spec pre-existing 失败与本 change 无关）与 demo build（✓）
- [x] 7.3 更新页面声明与实际覆盖一致（67 组件全陈列），浏览器查看确认
