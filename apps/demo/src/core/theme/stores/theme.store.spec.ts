import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useThemeStore, readPersistedTheme, THEME_STORAGE_KEY } from './theme.store';
import { lightTokens, darkTokens } from '../tokens';
import { findPreset } from '../presets';

/*
 * 注意：默认值已从「亮色 + blue」改为「暗色 + screen（大屏深青）」——
 * 管理系统外壳采用大屏深青风，内容区必须同为暗色，否则出现「深色壳 + 白色表格」的割裂。
 * 下面所有断言都按新默认值书写。
 */
describe('readPersistedTheme（持久化读取 + 容错）', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('无存储时返回默认（暗色 + screen 预设）', () => {
    const r = readPersistedTheme();
    expect(r.mode).toBe('dark');
    expect(r.presetKey).toBe('screen');
  });

  it('正常存储时正确恢复', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'light', presetKey: 'green' }));
    const r = readPersistedTheme();
    expect(r.mode).toBe('light');
    expect(r.presetKey).toBe('green');
  });

  it('损坏的 JSON 静默回退默认（不抛异常）', () => {
    localStorage.setItem(THEME_STORAGE_KEY, '{not a valid json');
    const r = readPersistedTheme();
    expect(r.mode).toBe('dark');
    expect(r.presetKey).toBe('screen');
  });

  it('非法 mode 值回退为默认模式', () => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ mode: 'hacker-mode', presetKey: 'blue' }),
    );
    expect(readPersistedTheme().mode).toBe('dark');
  });

  it('非法 presetKey 回退为默认预设', () => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ mode: 'light', presetKey: 'unknown-preset' }),
    );
    expect(readPersistedTheme().presetKey).toBe('screen');
  });
});

describe('useThemeStore（状态 / 派生 / 持久化）', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('无持久化时以默认值初始化', () => {
    const s = useThemeStore();
    expect(s.mode).toBe('dark');
    expect(s.presetKey).toBe('screen');
    expect(s.isDark).toBe(true);
  });

  it('从持久化数据初始化', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark', presetKey: 'purple' }));
    const s = useThemeStore();
    expect(s.mode).toBe('dark');
    expect(s.presetKey).toBe('purple');
    expect(s.isDark).toBe(true);
  });

  it('setMode 切换暗色：currentTokens 切到暗色基础值并写入持久化', () => {
    const s = useThemeStore();
    // 先切到 blue：它只覆盖 primary、不覆盖 bg，才能验证「bg 取暗色基础值」
    s.setPreset('blue');
    s.setMode('dark');
    expect(s.isDark).toBe(true);
    expect(s.currentTokens.bg.page).toBe(darkTokens.bg.page);

    const raw = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? '{}');
    expect(raw.mode).toBe('dark');
  });

  it('toggleMode 在亮/暗间翻转', () => {
    const s = useThemeStore();
    expect(s.mode).toBe('dark');
    s.toggleMode();
    expect(s.mode).toBe('light');
    s.toggleMode();
    expect(s.mode).toBe('dark');
  });

  it('setPreset 覆盖 primary 色阶，其余功能色保持模式默认', () => {
    const s = useThemeStore();
    s.setPreset('green');
    const green = findPreset('green')!;
    expect(s.currentTokens.colors.primary.DEFAULT).toBe(green.primary.DEFAULT);
    // green 未覆盖 success，故仍为当前模式（默认暗色）的基础值
    expect(s.currentTokens.colors.success.DEFAULT).toBe(darkTokens.colors.success.DEFAULT);
  });

  it('setPreset 忽略未注册的 key（不写入、不改变）', () => {
    const s = useThemeStore();
    s.setPreset('__not_registered__');
    expect(s.presetKey).toBe('screen');
  });

  it('screen 预设同时覆盖 bg / border / text（深青是一整套，不是只换主色）', () => {
    const s = useThemeStore();
    const screen = findPreset('screen')!;

    expect(s.presetKey).toBe('screen');
    expect(s.currentTokens.colors.primary.DEFAULT).toBe(screen.primary.DEFAULT);
    expect(s.currentTokens.bg.page).toBe(screen.bg?.page);
    expect(s.currentTokens.border.light).toBe(screen.border?.light);
    expect(s.currentTokens.text.title).toBe(screen.text?.title);
  });

  it('currentTokens 在暗色 + 预设下：base 来自暗色、primary 来自预设', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark', presetKey: 'orange' }));
    const s = useThemeStore();
    const orange = findPreset('orange')!;
    expect(s.currentTokens.colors.primary.DEFAULT).toBe(orange.primary.DEFAULT);
    // 暗色 base（未被 orange 覆盖）
    expect(s.currentTokens.bg.page).toBe(darkTokens.bg.page);
    expect(s.currentTokens.colors.success.DEFAULT).toBe(darkTokens.colors.success.DEFAULT);
  });

  it('亮色模式 + blue 预设时回到浅色基础值', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'light', presetKey: 'blue' }));
    const s = useThemeStore();
    expect(s.currentTokens.bg.page).toBe(lightTokens.bg.page);
    expect(s.currentTokens.text.title).toBe(lightTokens.text.title);
  });
});
