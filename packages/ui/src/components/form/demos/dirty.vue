<!-- packages/ui/src/components/form/demos/dirty.vue -->
<!-- TmForm 变更追踪演示：isDirty / getDirtyFields / resetToInitial / markInitial -->
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Space } from 'ant-design-vue'
import { TmForm, TmFormItem, type FormInstance } from '../index'
import { TmButton } from '../../button/index'
import TmInput from '../../input/src/Input.vue'
import TmSelect from '../../select/src/Select.vue'

// 变更追踪方法经 formRef 暴露（isDirty/getDirtyFields/resetToInitial/markInitial）
const formRef = ref<FormInstance & {
  isDirty: () => boolean
  getDirtyFields: () => string[]
  resetToInitial: () => void
  markInitial: () => void
}>()

const formState = reactive<{
  name: string
  city: string | number | undefined
}>({
  name: '张伟',
  city: 'hangzhou',
})

// 响应式追踪脏状态：computed 内调用 isDirty()/getDirtyFields() 会读取 model，
// Vue 自动收集依赖，model 变化时提示实时更新
const isDirty = computed(() => formRef.value?.isDirty?.() ?? false)
const dirtyFields = computed(() => formRef.value?.getDirtyFields?.() ?? [])

// 重置到 onMounted 时的初始快照（字段值恢复 + 清除校验）
const handleReset = (): void => {
  formRef.value?.resetToInitial()
}

// 模拟「提交成功后标记为已同步」：isDirty 复位 false
const handleSave = (): void => {
  formRef.value?.markInitial()
}
</script>

<template>
  <div>
    <TmForm ref="formRef" :model="formState" layout="horizontal">
      <TmFormItem label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
        <TmInput v-model="formState.name" placeholder="请输入姓名" />
      </TmFormItem>

      <TmFormItem label="城市" name="city">
        <TmSelect
          v-model="formState.city"
          :options="[
            { label: '北京', value: 'beijing' },
            { label: '杭州', value: 'hangzhou' },
          ]"
        />
      </TmFormItem>

      <TmFormItem :wrapper-col="{ offset: 4 }">
        <Space>
          <TmButton type="primary" @click="handleSave">模拟保存（markInitial）</TmButton>
          <TmButton @click="handleReset">重置到初始值</TmButton>
        </Space>
      </TmFormItem>
    </TmForm>

    <!-- 脏状态提示：有字段修改时高亮 -->
    <div v-if="isDirty" style="margin-top: 8px; color: #faad14">
      表单已修改（{{ dirtyFields.length }} 个字段：{{ dirtyFields.join('、') }}）
    </div>
    <div v-else style="margin-top: 8px; color: #52c41a">表单与初始值一致</div>
  </div>
</template>
