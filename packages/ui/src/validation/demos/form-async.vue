<!-- packages/ui/src/validation/demos/form-async.vue -->
<!-- 异步判据演示：registerValidator 注册一个「模拟远程唯一性检查」的判据（返回 Promise），
     校验会等它兑现后才给结论——这是本地正则表达不了的场景（判据依赖外部数据源） -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TmButton } from '../../components/button'
import { TmForm, TmFormItem } from '../../components/form'
import { TmInput } from '../../components/input'
import { toAntRule } from '../adapters/ant'
import { registerValidator } from '../registry'

/** 模拟服务端已有数据：这些编号已被占用 */
const TAKEN_DEVICE_NOS = new Set(['DEV-0001', 'DEV-0002'])

/** 模拟一次远程唯一性查询：150ms 后返回「编号是否可用」 */
function requestUnique(deviceNo: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(!TAKEN_DEVICE_NOS.has(deviceNo)), 3000)
  })
}

// 异步判据：返回 Promise，校验流程会等待它（同步判据写法与以往完全一致）
registerValidator('deviceNoUnique', (value) => requestUnique(String(value)))

const rules = {
  deviceNo: toAntRule({
    type: 'deviceNoUnique',
    required: true,
    requiredMessage: '请输入设备编号',
    message: '该编号已被占用，请换一个',
  }),
}

const formState = reactive({ deviceNo: '' })
const formRef = ref()
const result = ref('')
const checking = ref(false)

const onSubmit = async (): Promise<void> => {
  result.value = ''
  checking.value = true
  try {
    // validate() 内部会等待异步判据兑现
    await formRef.value?.validate()
    result.value = '校验通过 ✓'
  } catch (error) {
    const fields = (error as { errorFields?: Array<{ errors: string[] }> }).errorFields ?? []
    result.value = `校验未通过：${fields.map((f) => f.errors[0]).join('；')}`
  } finally {
    checking.value = false
  }
}
</script>

<template>
  <TmForm ref="formRef" :model="formState" :rules="rules" style="max-width: 460px">
    <TmFormItem label="设备编号" name="deviceNo">
      <TmInput v-model="formState.deviceNo" placeholder="试试已被占用的 DEV-0001 / DEV-0002" />
    </TmFormItem>
    <TmFormItem :wrapper-col="{ offset: 4 }">
      <TmButton type="primary" :loading="checking" @click="onSubmit">提交（异步校验）</TmButton>
    </TmFormItem>
    <TmFormItem v-if="result" :wrapper-col="{ offset: 4 }">
      <span :style="{ color: result === '校验通过 ✓' ? '#52c41a' : '#ff4d4f' }">{{ result }}</span>
    </TmFormItem>
  </TmForm>
</template>
