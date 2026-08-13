<!-- packages/ui/src/components/list/demos/load-more.vue -->
<!-- TmList 加载更多演示：loadMore 插槽 + 按钮分页追加数据 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { TmList, TmListItem, TmListItemMeta } from '../index'
import { TmButton } from '../../button'

interface UserItem {
  id: string
  name: string
  desc: string
}

// 完整数据源（模拟后端返回全量）
const all = ref<UserItem[]>(
  Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    name: `用户${i + 1}`,
    desc: `第 ${i + 1} 条列表描述`,
  })),
)

const pageSize = 5
const loading = ref(false)
// 当前可见条数（从完整数据源切片，模拟增量加载）
const visible = ref<UserItem[]>(all.value.slice(0, pageSize))
// 全部加载完则禁用按钮并切换文案
const noMore = computed(() => visible.value.length >= all.value.length)

function loadMore() {
  if (noMore.value) return
  loading.value = true
  // 模拟异步请求：500ms 后追加下一页
  setTimeout(() => {
    const next = visible.value.length + pageSize
    visible.value = all.value.slice(0, next)
    loading.value = false
  }, 500)
}
</script>

<template>
  <div style="width: 100%">
    <p>加载更多（loadMore 插槽 + 按钮分页追加数据）</p>
    <TmList :data-source="visible" style="width: 100%">
      <template #renderItem="{ item }">
        <TmListItem>
          <TmListItemMeta :title="item.name" :description="item.desc" />
        </TmListItem>
      </template>
      <template #loadMore>
        <div style="text-align: center; margin-top: 12px">
          <TmButton :loading="loading" :disabled="noMore" @click="loadMore">
            {{ noMore ? '没有更多了' : '加载更多' }}
          </TmButton>
        </div>
      </template>
    </TmList>
  </div>
</template>
