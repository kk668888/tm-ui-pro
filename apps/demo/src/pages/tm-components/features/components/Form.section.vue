<script setup lang="ts">
import { reactive, ref } from 'vue';
import { request } from '@/core/http';
import {
  TmForm,
  TmFormItem,
  type FormInstance,
  TmButton,
  TmInput,
  TmInputNumber,
  TmSelect,
  TmRadioGroup,
  TmCheckboxGroup,
  TmSwitch,
  TmDatePicker,
  TmRangePicker,
  TmCascader,
  TmTreeSelect,
  TmTimePicker,
  TmUpload,
  TmMessage,
  type UploadFile,
  TmAutoComplete,
  TmCheckbox,
  TmMentions,
  TmRadio,
  TmRate,
  TmSlider,
  TmTransfer,
  TmTree,
} from '@tm/ui';

defineOptions({ name: 'FormSection' });

// ── 基础控件 v-model 回显 ─────────────────────────────
const name = ref('');
const age = ref(30);
const fruit = ref<string>('apple');
const role = ref('admin');
const tags = ref<string[]>(['vue']);
const enabled = ref(true);
const date = ref('2026-08-11');
const range = ref(['2026-08-10', '2026-08-12'] as [string, string]);
const region = ref<string[]>(['zhejiang', 'hangzhou']);
const treeValue = ref('0-0-1');

const fruitOptions = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
];
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
];
const tagOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte', disabled: true },
];
const regionOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [{ value: 'nanjing', label: '南京' }],
  },
];
const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      { title: 'Child Node1', value: '0-0-1' },
      { title: 'Child Node2', value: '0-0-2' },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    children: [{ title: 'Child Node3', value: '0-1-1' }],
  },
];

// ── 新增控件：TimePicker（value-format 字符串模式）+ Upload（受控 fileList）──
const timeStr = ref('09:30:00');
const uploadList = ref<UploadFile[]>([]);

/** 演示 beforeUpload 拦截：超过 1MB 拒绝入列表 */
function beforeUpload(file: { size?: number }): boolean {
  return !(file.size && file.size > 1024 * 1024);
}

// ── 补充控件：AutoComplete/Checkbox/Mentions/Radio/Rate/Slider/Transfer/Tree ──
const acValue = ref('');
const acOptions = [{ value: 'Ant Design' }, { value: 'Ant Design Pro' }, { value: 'Vue' }, { value: 'React' }];
const singleChecked = ref(true);
const mentionValue = ref('');
const mentionOptions = ['afc163', 'zombieJ', 'yesmeck'].map((n) => ({ value: n, label: n }));
const singleRadio = ref('a');
const rateValue = ref(3.5);
const sliderValue = ref(40);
const transferData = [
  { key: '1', title: '内容一' },
  { key: '2', title: '内容二' },
  { key: '3', title: '内容三' },
];
const transferKeys = ref<string[]>(['1']);
const treeCheckedKeys = ref<string[]>(['0-0-1']);

// ── 字段联动：选择部门控制账户输入禁用 ──
const linkDept = ref<string | undefined>(undefined);
const linkAccount = ref('');
const remoteSelectValue = ref<string | undefined>(undefined);

/** 远程搜索选项：mock /api/users 按 name 过滤；jsdom 下失败返回空，保证演示稳定 */
async function fetchRemoteOptions(query: string): Promise<{ label: string; value: string }[]> {
  if (!query) return [];
  try {
    const res = await request.get<{ list: { id: string; name: string }[] }>('/api/users', {
      params: { name: query, pageSize: 50 },
    });
    return res.list.map((u) => ({ label: u.name, value: u.name }));
  } catch {
    return [];
  }
}

// ── TmForm 手动模式：校验 / 提交 / 脏追踪（0.1.0 无 schema，勿用 auto-generate）──
const formState = reactive<{ username: string; email: string; dept: string | undefined }>({
  username: '',
  email: '',
  dept: undefined,
});
type TmFormRef = FormInstance & {
  isDirty?: () => boolean;
  getDirtyFields?: () => string[];
  resetToInitial?: () => void;
  markInitial?: () => void;
};
const formRef = ref<TmFormRef>();
const submitting = ref(false);

async function onSubmit() {
  // try/finally 仅负责复位提交中状态，不吞掉非校验异常（如消息提示失败等）
  try {
    submitting.value = true;
    // 表单实例未挂载：校验未执行，直接返回，避免误报成功
    if (!formRef.value) {
      return;
    }
    // 单独捕获校验失败：仅该校验不通过时提示并终止，其它异常向上抛出
    try {
      await formRef.value.validate();
    } catch {
      TmMessage.warning('表单校验未通过，请检查');
      return;
    }
    await new Promise((r) => setTimeout(r, 600));
    TmMessage.success(`提交成功：${JSON.stringify(formState)}`);
    formRef.value?.markInitial?.();
  } finally {
    submitting.value = false;
  }
}

function onReset() {
  formRef.value?.resetToInitial?.();
}
</script>

<template>
  <a-card class="section-form" title="② 表单 Form">
    <p class="mb-4 text-sm text-secondary">
      表单控件统一 v-model，右侧实时回显；TmForm 手动模式演示必填 / 邮箱校验与脏追踪。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <TmInput v-model="name" placeholder="请输入用户名" allow-clear />
          <span class="ml-2 text-secondary">name={{ name || '空' }}</span>
        </div>
        <div>
          <TmInputNumber v-model="age" :min="0" :max="100" />
          <span class="ml-2 text-secondary">age={{ age }}</span>
        </div>
        <div>
          <TmSelect v-model="fruit" :options="fruitOptions" placeholder="请选择水果" style="width: 200px" />
          <span class="ml-2 text-secondary">fruit={{ fruit }}</span>
        </div>
        <div>
          <TmRadioGroup v-model="role" :options="roleOptions" />
          <span class="ml-2 text-secondary">role={{ role }}</span>
        </div>
        <div>
          <TmCheckboxGroup v-model="tags" :options="tagOptions" />
          <span class="ml-2 text-secondary">tags={{ tags.join('、') }}</span>
        </div>
        <div>
          <TmSwitch v-model="enabled" checked-children="开" un-checked-children="关" />
          <span class="ml-2 text-secondary">enabled={{ enabled }}</span>
        </div>
        <div>
          <TmDatePicker v-model="date" value-format="YYYY-MM-DD" style="width: 200px" />
          <span class="ml-2 text-secondary">date={{ date }}</span>
        </div>
        <div>
          <TmRangePicker v-model="range" value-format="YYYY-MM-DD" style="width: 280px" />
          <span class="ml-2 text-secondary">range={{ range.join('~') }}</span>
        </div>
        <div>
          <TmCascader v-model="region" :options="regionOptions" style="width: 240px" />
          <span class="ml-2 text-secondary">region={{ region.join('/') }}</span>
        </div>
        <div>
          <TmTreeSelect v-model="treeValue" :tree-data="treeData" style="width: 240px" />
          <span class="ml-2 text-secondary">tree={{ treeValue }}</span>
        </div>
        <div>
          <TmTimePicker v-model="timeStr" value-format="HH:mm:ss" style="width: 200px" />
          <span class="ml-2 text-secondary">time={{ timeStr }}</span>
        </div>
        <div>
          <TmUpload v-model:file-list="uploadList" action="/api/upload" :before-upload="beforeUpload">
            <TmButton>上传文件（限 1MB）</TmButton>
          </TmUpload>
          <span class="ml-2 text-secondary">files={{ uploadList.length }}</span>
        </div>
      </div>

      <a-divider orientation="left">TmForm 手动模式</a-divider>
      <TmForm
        ref="formRef"
        :model="formState"
        :disabled="submitting"
        :submitting="submitting"
        layout="horizontal"
      >
        <TmFormItem label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <TmInput v-model="formState.username" placeholder="请输入用户名" />
        </TmFormItem>
        <TmFormItem label="邮箱" name="email" :rules="[{ type: 'email', message: '邮箱格式错误' }]">
          <TmInput v-model="formState.email" placeholder="请输入邮箱" />
        </TmFormItem>
        <TmFormItem label="部门" name="dept">
          <TmSelect
            v-model="formState.dept"
            :options="[
              { label: '前端', value: 'fe' },
              { label: '后端', value: 'be' },
            ]"
            placeholder="请选择部门"
            style="width: 200px"
          />
        </TmFormItem>
        <TmFormItem v-if="formRef?.isDirty?.()" label=" ">
          <a-tag color="warning">已修改：{{ formRef?.getDirtyFields?.().join('、') }}</a-tag>
        </TmFormItem>
        <TmFormItem>
          <a-space>
            <TmButton type="primary" :loading="submitting" @click="onSubmit">提交（校验）</TmButton>
            <TmButton @click="onReset">重置到初始值</TmButton>
          </a-space>
        </TmFormItem>
      </TmForm>

      <a-divider orientation="left">补充控件 Extra</a-divider>

      <div>
        <p class="mb-2 text-xs text-secondary">TmAutoComplete：自动完成（输入联想）。</p>
        <TmAutoComplete v-model:value="acValue" :options="acOptions" style="width: 220px" placeholder="输入 a 试试" />
        <span class="ml-2 text-secondary">value={{ acValue || '空' }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmCheckbox：复选框（v-model:checked）。</p>
        <TmCheckbox v-model:checked="singleChecked">同意协议</TmCheckbox>
        <span class="ml-2 text-secondary">checked={{ singleChecked }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmMentions：提及（@ 触发）。</p>
        <TmMentions v-model:value="mentionValue" :options="mentionOptions" style="width: 220px" placeholder="输入 @ 触发" />
        <span class="ml-2 text-secondary">value={{ mentionValue || '空' }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmRadio：单选框（v-model:checked）。</p>
        <a-space>
          <TmRadio v-model:checked="singleRadio" value="a">选项 A</TmRadio>
          <TmRadio v-model:checked="singleRadio" value="b">选项 B</TmRadio>
        </a-space>
        <span class="ml-2 text-secondary">value={{ singleRadio }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmRate：评分（v-model + allow-half）。</p>
        <TmRate v-model:value="rateValue" allow-half />
        <span class="ml-2 text-secondary">{{ rateValue }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmSlider：滑块（v-model + 范围）。</p>
        <TmSlider v-model:value="sliderValue" :min="0" :max="100" style="max-width: 320px" />
        <span class="ml-2 text-secondary">{{ sliderValue }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmTransfer：穿梭框（v-model:targetKeys）。</p>
        <TmTransfer v-model:targetKeys="transferKeys" :data-source="transferData" :render="(item: { title: string }) => item.title" style="max-width: 480px" />
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmTree：树（勾选受控 checkedKeys）。</p>
        <TmTree v-model:checkedKeys="treeCheckedKeys" :tree-data="treeData" checkable style="max-width: 300px" />
        <span class="ml-2 text-secondary">checked={{ treeCheckedKeys.join('、') }}</span>
      </div>

      <a-divider orientation="left">字段联动 Field Linking</a-divider>
      <div>
        <p class="mb-2 text-xs text-secondary">选择「前端」后才可输入账户（禁用联动）。</p>
        <a-space>
          <TmSelect
            v-model="linkDept"
            :options="[
              { label: '前端', value: 'fe' },
              { label: '后端', value: 'be' },
            ]"
            placeholder="请选择部门"
            style="width: 200px"
          />
          <TmInput v-model="linkAccount" :disabled="linkDept !== 'fe'" placeholder="未选前端时禁用" style="width: 220px" />
        </a-space>
      </div>

      <a-divider orientation="left">Select 远程搜索 Remote Select</a-divider>
      <div>
        <p class="mb-2 text-xs text-secondary">TmSelect 远程搜索（输入关键词，mock /api/users 过滤）。</p>
        <TmSelect
          v-model="remoteSelectValue"
          :remote="fetchRemoteOptions"
          :filter-option="false"
          placeholder="输入用户名搜索"
          style="width: 240px"
        />
        <span class="ml-2 text-secondary">value={{ remoteSelectValue || '空' }}</span>
      </div>
    </a-space>
  </a-card>
</template>
