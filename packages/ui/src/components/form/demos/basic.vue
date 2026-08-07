<!-- packages/ui/src/components/form/demos/basic.vue -->
<!-- TmForm / TmFormItem 基础演示：v-model 表单 + validate 透传 + 级联 readonly/disabled + 变更追踪 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Space } from 'ant-design-vue'
import { TmForm, TmFormItem, type FormInstance } from '../index'
import { TmButton } from '../../button/index'
import TmInput from '../../input/src/Input.vue'
import TmSelect from '../../select/src/Select.vue'

// 表单数据（reactive 让 ant Form 能监听字段变化做校验）
const formState = reactive<{
  name: string
  fruit: string | number | undefined
}>({
  name: '',
  fruit: undefined,
})

// TmForm ref：业务侧通过它调用 validate / resetFields / 变更追踪等方法
const formRef = ref<FormInstance & {
  isDirty: () => boolean
  getDirtyFields: () => string[]
  resetToInitial: () => void
  markInitial: () => void
}>()

// 模拟提交的 loading 态
const submitting = ref(false)

const onSubmit = async (): Promise<void> => {
  try {
    submitting.value = true
    await formRef.value?.validate()
    // 模拟异步提交
    await new Promise((r) => setTimeout(r, 1000))
    window.alert(`提交成功：${JSON.stringify(formState)}`)
    // 提交成功后标记为「初始值」—— isDirty 回到 false
    formRef.value?.markInitial()
  } catch (error) {
    console.warn('表单校验未通过', error)
  } finally {
    submitting.value = false
  }
}

const onReset = (): void => {
  formRef.value?.resetToInitial()
}

// 演示级联 disabled（切换整表禁用）
const disabled = ref(false)

const toggleDisabled = (): void => {
  disabled.value = !disabled.value
}
</script>

<template>
  <TmForm
    ref="formRef"
    :model="formState"
    :disabled="disabled"
    :submitting="submitting"
    layout="horizontal"
  >
    <TmFormItem label="名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
      <TmInput v-model="formState.name" placeholder="请输入名称" />
    </TmFormItem>

    <TmFormItem label="水果" name="fruit" :rules="[{ required: true, message: '请选择水果' }]">
      <TmSelect
        v-model="formState.fruit"
        :options="[
          { label: '苹果', value: 'apple' },
          { label: '香蕉', value: 'banana' },
        ]"
        placeholder="请选择水果"
      />
    </TmFormItem>

    <!-- 变更追踪反馈 -->
    <TmFormItem v-if="formRef?.isDirty?.()" label=" " :wrapper-col="{ offset: 4 }">
      <span style="color: #faad14">表单已修改（脏字段：{{ formRef?.getDirtyFields?.().join('、') }}）</span>
    </TmFormItem>

    <TmFormItem :wrapper-col="{ offset: 4 }">
      <Space>
        <TmButton type="primary" :loading="submitting" @click="onSubmit">
          提交（触发 validate）
        </TmButton>
        <TmButton @click="onReset">重置到初始值</TmButton>
        <TmButton @click="toggleDisabled">
          {{ disabled ? '启用' : '禁用' }}整表
        </TmButton>
      </Space>
    </TmFormItem>
  </TmForm>
</template>
