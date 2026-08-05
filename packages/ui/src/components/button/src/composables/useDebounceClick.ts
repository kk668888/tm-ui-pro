// packages/ui/src/components/button/src/composables/useDebounceClick.ts
// 防抖点击 composable：拦截原生 click，按 debounce 间隔节流后再向业务 emit
// 设计要点：
// 1. 未配置 debounce（0 / undefined）时零开销透传，保持 ant 原生点击响应
// 2. 配置后采用「尾部节流」语义——连续点击只会在最后一次点击后 debounce ms 触发一次
// 3. onBeforeUnmount 显式清掉 timer，避免组件卸载后异步任务仍触发 emit（内存/逻辑安全）
import { onBeforeUnmount } from 'vue'
import type { TmButtonProps } from '../props'

// MouseEvent 取自 DOM 全局类型（lib: DOM 已包含），无需从 vue import

/**
 * 防抖点击返回结构
 * @property onClick 绑定到内部 AButton 的 click 处理函数
 */
export interface UseDebounceClickReturn {
  onClick: (ev: MouseEvent) => void
}

/**
 * 创建一个防抖点击处理器
 *
 * 必须在组件 setup 期间调用（内部依赖 onBeforeUnmount 注册卸载钩子）。
 *
 * @param props 只读取 debounce 字段，避免响应式依赖扩散
 * @param emit  TmButton 的 click emit 函数
 * @returns {@link UseDebounceClickReturn}
 */
export function useDebounceClick(
  props: Pick<TmButtonProps, 'debounce'>,
  emit: (e: 'click', ev: MouseEvent) => void,
): UseDebounceClickReturn {
  // timer 持有 setTimeout 句柄；undefined 表示当前无待触发任务
  let timer: ReturnType<typeof setTimeout> | undefined

  const onClick = (ev: MouseEvent) => {
    // 未配置防抖：直接同步 emit，与 ant 原生按钮一致
    if (!props.debounce) return emit('click', ev)
    // 已有待触发任务：清空重排，保证只在最后一次点击后 debounce ms 触发
    clearTimeout(timer)
    timer = setTimeout(() => emit('click', ev), props.debounce)
  }

  // 组件卸载前清掉待触发 timer：防止已卸载组件仍 emit click（避免业务侧「幽灵点击」）
  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  })

  return { onClick }
}
