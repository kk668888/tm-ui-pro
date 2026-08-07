<!-- packages/ui/src/components/form/demos/submitting.vue -->
<!-- TmForm submitting 级联演示：提交 loading 态经 FormContext 下发到按钮区 -->
<!-- 业务触发点是弹窗/抽屉 footer 按钮时，submitting 由业务在调用处控制；此处用表单内按钮演示 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Space } from 'ant-design-vue'
import { TmForm, TmFormItem } from '../index'
import { TmButton } from '../../button/index'
import TmInput from '../../input/src/Input.vue'

const formState = reactive({ name: '' })
const submitting = ref(false)

// 模拟提交：setTimeout 期间 submitting = true，
// 表单内按钮（经 TmFormItem slot props 拿到 submitting）自动 loading + 禁用，防止重复提交
const handleSubmit = async (): Promise<void> => {
  submitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    window.alert('提交完成')
  } finally {
    submitting.value = false
  }
}

const handleReset = (): void => {
  formState.name = ''
}
</script>

<template>
  <TmForm :model="formState" :submitting="submitting" layout="horizontal">
    <TmFormItem label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
      <TmInput v-model="formState.name" placeholder="请输入姓名" />
    </TmFormItem>

    <!--
      v-slot="{ submitting }"：从 FormItem 拿 FormContext 下发的 submitting
      提交按钮 loading + 禁用，重置按钮仅禁用——防重复提交
    -->
    <TmFormItem :wrapper-col="{ offset: 4 }" v-slot="{ submitting: ctxSubmitting }">
      <Space>
        <TmButton type="primary" :loading="ctxSubmitting" :disabled="ctxSubmitting" @click="handleSubmit">
          提交
        </TmButton>
        <TmButton :disabled="ctxSubmitting" @click="handleReset">重置</TmButton>
      </Space>
    </TmFormItem>
  </TmForm>
</template>
