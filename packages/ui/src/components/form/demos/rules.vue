<!-- packages/ui/src/components/form/demos/rules.vue -->
<!-- 字段校验演示：配合 Validation 工具函数 toAntRule 产出规则数组，三类典型各来一条 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TmForm, TmFormItem } from '../index'
import { TmButton } from '../../button'
import { TmInput } from '../../input'
import { TmInputNumber } from '../../input-number'
import { toAntRule } from '../../../validation'

// 表单数据（reactive 让 ant Form 能监听字段变化做校验）
const formState = reactive<{
  phone: string
  age: number | undefined
  idCard: string
}>({
  phone: '',
  age: undefined,
  idCard: '',
})

const formRef = ref()
const result = ref('')

// 正则类 + 必填：空值提示 requiredMessage，格式错误提示 message（两条文案互不干扰）
const phoneRules = toAntRule({
  type: 'phone',
  required: true,
  requiredMessage: '请输入手机号',
  message: '手机号格式不正确',
})

// 比较类：数值闭区间（配 TmInputNumber 数值控件）；非必填时空值直接通过
const ageRules = toAntRule({ type: 'range', min: 1, max: 120, message: '年龄需在 1~120 之间' })

// 计算类：身份证含 GB 11643 校验位，格式对但校验位错同样拦下
const idCardRules = toAntRule({
  type: 'idCard',
  message: '身份证号码不正确（含校验位校验）',
})

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
      <TmInput v-model="formState.phone" placeholder="留空与输入 123 分别看两条文案" />
    </TmFormItem>
    <TmFormItem label="年龄" name="age" :rules="ageRules">
      <TmInputNumber v-model="formState.age" :min="1" :max="150" placeholder="非必填，留空直接通过" style="width: 100%" />
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
