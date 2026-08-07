<!-- packages/ui/src/components/form/demos/readonly.vue -->
<!-- TmForm readonly/disabled 级联演示：只读模式 + 整表禁用，切换查看 Input/Select 联动 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Space } from 'ant-design-vue'
import { TmForm, TmFormItem } from '../index'
import { TmButton } from '../../button/index'
import TmInput from '../../input/src/Input.vue'
import TmSelect from '../../select/src/Select.vue'

// 表单数据
const formState = reactive<{
  name: string
  city: string | number | undefined
}>({
  name: '张伟',
  city: 'hangzhou',
})

// 三种模式互斥切换：编辑 / 只读 / 禁用
const mode = ref<'edit' | 'readonly' | 'disabled'>('edit')

const toggleMode = (): void => {
  mode.value = mode.value === 'edit' ? 'readonly' : mode.value === 'readonly' ? 'disabled' : 'edit'
}

const modeText = { edit: '只读', readonly: '禁用', disabled: '编辑' }[mode.value]
</script>

<template>
  <div>
    <TmForm :model="formState" :readonly="mode === 'readonly'" :disabled="mode === 'disabled'" layout="horizontal">
      <!-- readonly 级联到 TmInput：输入框不可编辑但保留文字与底色（区别于 disabled 的灰底） -->
      <TmFormItem label="姓名" name="name">
        <TmInput v-model="formState.name" placeholder="请输入姓名" />
      </TmFormItem>

      <!-- disabled 级联到 TmSelect：整表禁用时下拉不可点 -->
      <TmFormItem label="城市" name="city">
        <TmSelect
          v-model="formState.city"
          :options="[
            { label: '北京', value: 'beijing' },
            { label: '杭州', value: 'hangzhou' },
            { label: '深圳', value: 'shenzhen' },
          ]"
        />
      </TmFormItem>

      <TmFormItem :wrapper-col="{ offset: 4 }">
        <Space>
          <TmButton type="primary" @click="toggleMode">切换为{{ modeText }}</TmButton>
          <span v-if="mode === 'readonly'" style="color: #1677ff">当前为只读（input 可选中不可编辑）</span>
          <span v-else-if="mode === 'disabled'" style="color: #faad14">当前为禁用（整表灰底）</span>
        </Space>
      </TmFormItem>
    </TmForm>
  </div>
</template>
