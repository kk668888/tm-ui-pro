<!-- packages/ui/src/components/alert/demos/basic.vue -->
<!-- TmAlert 基础演示：status 语义类型映射 + 显式 type 覆盖 -->
<script setup lang="ts">
import { TmAlert } from '../index'
</script>

<template>
  <div class="alert-demo">
    <TmAlert status="success" message="操作成功" description="数据已保存" />
    <!-- 业务语义枚举无 info：info 归一到 processing 由内部映射（ant Alert 无 processing → info） -->
    <TmAlert status="processing" message="信息提示" description="这是一条普通信息" />
    <TmAlert status="failed" message="操作失败" description="请稍后重试" />
    <TmAlert status="warning" message="警告提示" description="当前配置可能影响其他模块" />
    <TmAlert type="error" message="显式 type 覆盖 status" />
  </div>
</template>

<style scoped>
.alert-demo > :deep(.ant-alert) {
  margin-bottom: 12px;
}
</style>
