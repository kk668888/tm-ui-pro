<!-- packages/ui/src/validation/demos/form-item.vue -->
<!-- TmFormItem × toAntRule 演示：rules 逐字段就地绑定（字段少、规则就地可读的写法） -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TmButton } from '../../components/button'
import { TmForm, TmFormItem } from '../../components/form'
import { TmInput } from '../../components/input'
import { toAntRule } from '../adapters/ant'

// 逐字段就地绑定：规则直接写在对应 TmFormItem 的 rules 上
const phoneRules = toAntRule({
  type: 'phone',
  required: true,
  requiredMessage: '请输入手机号',
  message: '手机号格式不正确',
})

// 非必填：空值直接通过，填了才校验格式
const emailRules = toAntRule({ type: 'email' })

// 计算类：身份证含 GB 11643 校验位算法，仅格式正确但校验位错误同样拦下
const idCardRules = toAntRule({ type: 'idCard', required: true })

const formState = reactive({ phone: '', email: '', idCard: '' })
const formRef = ref()
const result = ref('')

const onSubmit = async (): Promise<void> => {
  result.value = ''
  try {
    await formRef.value?.validate()
    result.value = '校验通过 ✓'
  } catch (error) {
    const fields = (error as { errorFields?: Array<{ errors: string[] }> }).errorFields ?? []
    result.value = `校验未通过：${fields.map((f) => f.errors[0]).join('；')}`
  }
}
</script>

<template>
  <TmForm ref="formRef" :model="formState" style="max-width: 460px">
    <TmFormItem label="手机号" name="phone" :rules="phoneRules">
      <TmInput v-model="formState.phone" placeholder="留空试必填文案，输入 123 试格式文案" />
    </TmFormItem>
    <TmFormItem label="邮箱" name="email" :rules="emailRules">
      <TmInput v-model="formState.email" placeholder="非必填：留空直接通过" />
    </TmFormItem>
    <TmFormItem label="身份证" name="idCard" :rules="idCardRules">
      <TmInput v-model="formState.idCard" placeholder="试试 11010519491231002X" />
    </TmFormItem>
    <TmFormItem :wrapper-col="{ offset: 4 }">
      <TmButton type="primary" @click="onSubmit">提交校验</TmButton>
    </TmFormItem>
    <TmFormItem v-if="result" :wrapper-col="{ offset: 4 }">
      <span :style="{ color: result === '校验通过 ✓' ? '#52c41a' : '#ff4d4f' }">{{ result }}</span>
    </TmFormItem>
  </TmForm>
</template>
