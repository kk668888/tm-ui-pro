<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { TmButton, TmMessage, TmModal, TmDrawer, TmNotification } from '@tm/ui';

defineOptions({ name: 'FeedbackSection' });

const modalOpen = ref(false);
const drawerOpen = ref(false);

// 加载态定时器句柄：组件卸载时清理，避免卸载后仍关闭已脱离的 message 实例
let loadingTimer: ReturnType<typeof setTimeout>;

// 无 TmApp 包裹时 TmMessage/TmNotification 自动降级 ant 全局实例，功能可用
function notify(type: 'success' | 'info' | 'warning' | 'error') {
  // 各类型语义互斥，用 switch 分支替代链式 if，行为不变
  switch (type) {
    case 'success':
      TmNotification.success({ message: '任务完成', description: '导出已就绪，可查看结果' });
      break;
    case 'info':
      TmNotification.info({ message: '系统升级', description: '今晚 02:00-04:00' });
      break;
    case 'warning':
      TmNotification.warning({ message: '磁盘不足', description: '已使用 90%' });
      break;
    case 'error':
      TmNotification.error({ message: '任务失败', description: '请重试' });
      break;
  }
}

function showLoading() {
  const close = TmMessage.loading('加载中...');
  loadingTimer = setTimeout(close, 2000);
}

onBeforeUnmount(() => {
  clearTimeout(loadingTimer);
});
</script>

<template>
  <a-card class="section-feedback" title="④ 反馈 Feedback">
    <p class="mb-4 text-sm text-secondary">
      TmMessage / TmNotification 命令式调用；TmModal / TmDrawer 组件式 v-model 开关。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <div class="flex flex-col gap-2">
        <span class="text-sm text-secondary">TmMessage</span>
        <a-space wrap>
          <TmButton type="primary" @click="TmMessage.success('保存成功')">成功</TmButton>
          <TmButton @click="TmMessage.info('这是一条信息提示')">信息</TmButton>
          <TmButton @click="TmMessage.warning('磁盘空间不足')">警告</TmButton>
          <TmButton danger @click="TmMessage.error('操作失败，请重试')">错误</TmButton>
          <TmButton @click="showLoading">加载</TmButton>
        </a-space>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-sm text-secondary">TmModal / TmDrawer</span>
        <a-space wrap>
          <TmButton type="primary" @click="modalOpen = true">打开弹窗</TmButton>
          <TmButton @click="drawerOpen = true">打开抽屉</TmButton>
        </a-space>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-sm text-secondary">TmNotification</span>
        <a-space wrap>
          <TmButton type="primary" @click="notify('success')">成功</TmButton>
          <TmButton @click="notify('info')">信息</TmButton>
          <TmButton @click="notify('warning')">警告</TmButton>
          <TmButton danger @click="notify('error')">错误</TmButton>
        </a-space>
      </div>

      <TmModal v-model="modalOpen" title="基础弹窗" @ok="modalOpen = false" @cancel="modalOpen = false">
        <p>弹窗内容，支持任意插槽与 ant Modal 全部 props / events。</p>
      </TmModal>
      <TmDrawer v-model="drawerOpen" title="基础抽屉" placement="right" :width="400">
        <p>抽屉内容，支持任意插槽与 ant Drawer 全部 props / events。</p>
      </TmDrawer>
    </a-space>
  </a-card>
</template>
