<!-- packages/ui/src/components/list/demos/basic.vue -->
<!-- TmList 基础演示：dataSource + #renderItem + TmListItem / TmListItemMeta -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmList, TmListItem, TmListItemMeta } from '../index'

interface UserItem {
  id: string
  name: string
  desc: string
}

const items = ref<UserItem[]>([
  { id: '1', name: '张三', desc: '前端工程师' },
  { id: '2', name: '李四', desc: '后端工程师' },
  { id: '3', name: '王五', desc: '测试工程师' },
])
</script>

<template>
  <div style="width: 100%">
    <p>基础列表（dataSource + renderItem）</p>
    <TmList :data-source="items" style="width: 100%">
      <template #renderItem="{ item }">
        <TmListItem>
          <TmListItemMeta :title="item.name" :description="item.desc" />
        </TmListItem>
      </template>
    </TmList>
  </div>
</template>
