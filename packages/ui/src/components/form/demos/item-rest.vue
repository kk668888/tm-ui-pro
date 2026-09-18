<!-- packages/ui/src/components/form/demos/item-rest.vue -->
<!--
  TmFormItemRest 详细演示：
  1. 同一 FormItem（带 name）内的主控件会按 name 采集进表单数据
  2. 同一个 FormItem 内包进 TmFormItemRest 的辅助控件不被采集、不参与校验
  说明：与原生 <a-form-item-rest> 是同一组件对象（别名复用），行为完全一致。
  若不包豁免区，同一 name 下挂多个控件会互相覆盖字段值——这正是豁免区的用武之地。
-->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TmForm, TmFormItem, TmFormItemRest, type FormInstance } from '../index'
import { TmInput } from '../../input'
import { TmButton } from '../../button'

/** 表单数据：username 会被采集；hint 仅界面交互用（不进表单数据） */
const formState = reactive({ username: '', hint: '' })

/** 表单实例（仅用 getFieldsValue 做演示回显） */
const formRef = ref<FormInstance>()

/** 点按钮后回显「表单实际采集到的字段」 */
const collected = ref('')

function showCollected(): void {
  collected.value = JSON.stringify(formRef.value?.getFieldsValue() ?? {})
}
</script>

<template>
  <div>
    <b>主控件被采集，豁免区控件不被采集</b>
    <TmForm ref="formRef" :model="formState" layout="vertical" style="max-width: 360px">
      <TmFormItem
        label="用户名（同一 name 下：主控件进表单数据）"
        name="username"
        :rules="[{ required: true, message: '请输入用户名' }]">
        <TmInput v-model="formState.username" placeholder="请输入用户名" />
        <!-- 辅助控件：不加豁免区会被当成同一字段的第二个控件，互相覆盖取值 -->
        <TmFormItemRest>
          <TmInput v-model="formState.hint" placeholder="辅助输入，仅界面交互用" style="margin-top: 8px" />
        </TmFormItemRest>
      </TmFormItem>

      <TmFormItem>
        <TmButton type="primary" @click="showCollected">查看采集值</TmButton>
      </TmFormItem>
    </TmForm>
    <p>getFieldsValue() = {{ collected || '（点上方按钮查看）' }}</p>
  </div>
</template>
