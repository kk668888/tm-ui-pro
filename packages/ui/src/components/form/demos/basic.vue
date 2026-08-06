<!-- packages/ui/src/components/form/demos/basic.vue -->
<!-- TmForm / TmFormItem 基础演示：v-model 表单 + validate 方法透传 + 联动通道预留 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TmForm, TmFormItem, type FormInstance } from '../index'
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

// TmForm ref：业务侧通过它调用 validate / resetFields 等方法（透传自内部 AForm）
const formRef = ref<FormInstance>()

const onSubmit = async (): Promise<void> => {
  try {
    // 真实校验链路：经 useForwardRef 透传到 ant Form.validate
    await formRef.value?.validate()
    // 校验通过 → 提交（此处仅演示，无后端调用）
    window.alert(`提交成功：${JSON.stringify(formState)}`)
  } catch (error) {
    // 校验失败 → ant Form 自动展示字段错误（error 含错误字段实体）
    console.warn('表单校验未通过', error)
  }
}

const onReset = (): void => {
  // 经透传调用 ant Form.resetFields 复位全部字段
  formRef.value?.resetFields()
}
</script>

<template>
  <TmForm ref="formRef" :model="formState" layout="horizontal">
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

    <TmFormItem :wrapper-col="{ offset: 4 }">
      <button type="button" @click="onSubmit">提交（触发 validate）</button>
      <button type="button" @click="onReset">重置（触发 resetFields）</button>
    </TmFormItem>
  </TmForm>
</template>
