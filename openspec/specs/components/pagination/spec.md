## Purpose

Defines TmPagination, a thin ant-design-vue Pagination wrapper with company default size-changer options aligned to the TmTable page config, so paging UX is consistent across business lists.

## Requirements

### Requirement: 公司分页默认

TmPagination SHALL 提供公司默认 `showSizeChanger`（默认 `true`）与 `pageSizeOptions`（`[10, 20, 50]`，与 TmTable 分页配置对齐），业务传值覆盖。

#### Scenario: 默认显示分页切换

- **WHEN** 渲染 `<TmPagination :total="100">` 且业务不传 `showSizeChanger`
- **THEN** 显示每页条数切换器，选项为 10 / 20 / 50

#### Scenario: 业务覆盖切换

- **WHEN** 业务传 `showSizeChanger="false"` 或 `:page-size-options="['5','10']"`
- **THEN** 按业务配置渲染，公司默认不生效

### Requirement: 透传与事件

TmPagination SHALL 透传 ant Pagination 原生 props / events（`current` / `pageSize` / `total` / `showTotal` / `showQuickJumper` / `onChange`），业务对 ant 的用法不变。

#### Scenario: 页码变化事件

- **WHEN** 用户点击页码且传入 `@change`
- **THEN** 触发 ant onChange 回调（page, pageSize）

#### Scenario: 受控页码

- **WHEN** 传入 `:current` 与 `:page-size`
- **THEN** 分页器按受控状态渲染
