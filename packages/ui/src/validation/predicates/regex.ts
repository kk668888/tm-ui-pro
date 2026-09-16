// packages/ui/src/validation/predicates/regex.ts
// 正则类判据内核：一段正则 + 一个纯函数，零外部依赖、零 UI 库耦合
//
// 单一事实来源：适配器产出 pattern 规则时也从这里取正则（REGEX_PATTERNS），
// 保证「内核判据」与「产出的规则」不会漂移（design D2）。

/**
 * 各正则类类型的标准正则
 * - 适配器产出 pattern 规则时直接引用本表
 * - 内核 isXxx 纯函数也用本表判定，两处天然同源
 */
export const REGEX_PATTERNS = {
  /**
   * IPv4：点分四段十进制，每段 0-255（允许前导零，如 192.168.001.001）
   * (25[0-5]|2[0-4]\d|[01]?\d\d?) → 250-255 / 200-249 / 0-199（含 01、001 这类前导零写法）
   */
  ipv4: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,

  /**
   * IPv6：标准文本表示 + :: 压缩（fe80::1、2001:db8::8:800:200c:417a、::1、::）
   * 注意范围：不含「IPv4 内嵌形式」（如 ::ffff:1.2.3.4），该边界在 spec 中已界定为范围外
   */
  ipv6: new RegExp(
    '^(([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}' + // 1:2:3:4:5:6:7:8 完整 8 组
      '|([0-9A-Fa-f]{1,4}:){1,7}:' + // 1:2:3:4:5:6:7:: → 尾部压缩
      '|([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}' + // 1::8
      '|([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2}' + // 1::7:8
      '|([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3}' + // 1::6:7:8
      '|([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4}' + // 1::5:6:7:8
      '|([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5}' + // 1::4:5:6:7:8
      '|[0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6})' + // fe80::1
      '|:((:[0-9A-Fa-f]{1,4}){1,7}|:))$', // ::1 / ::
  ),

  /**
   * MAC：六组两位十六进制；冒号或连字符分隔，且同一地址内分隔符必须一致
   * （两条分支分别匹配 : 与 -，天然排除 AA:BB-CC 这类混用）
   */
  mac: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$|^([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/,

  /**
   * 端口：整数 0-65535，纯数字分段穷举（对「数字串」做边界判定，不引入数值转换歧义）
   * 分段：65530-65535 / 65500-65529 / 65000-65499 / 60000-64999 / 10000-59999 / 0-9999
   */
  port: /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|\d{1,4})$/,

  /** 中国大陆手机号：1 开头、第二位 3-9、共 11 位 */
  phone: /^1[3-9]\d{9}$/,

  /** 邮箱：本地部分@域名.后缀（宽松实用型判定，不追 RFC 5322 全量文法） */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** URL：http/https 协议；host 须含点（或为 localhost），可带端口/路径/查询/锚点 */
  url: /^https?:\/\/(localhost(:\d+)?|([\w-]+\.)+[\w-]+)(:\d+)?([/?#]\S*)?$/,
} as const

/** 正则类类型名（与 REGEX_PATTERNS 的 key 一致） */
export type RegexPredicateKey = keyof typeof REGEX_PATTERNS

/**
 * 统一的正则匹配入口
 * - 仅接受字符串；数值（如 TmInputNumber 绑定的端口 8080）先转数字字符串再比对
 * - 其余类型（对象 / 数组 / 布尔等）一律不通过
 */
function matchPattern(value: unknown, pattern: RegExp): boolean {
  const text =
    typeof value === 'number' && Number.isFinite(value) ? String(value) : value
  return typeof text === 'string' && pattern.test(text)
}

/** IPv4 判据 */
export const isIpv4 = (value: unknown): boolean => matchPattern(value, REGEX_PATTERNS.ipv4)

/** IPv6 判据 */
export const isIpv6 = (value: unknown): boolean => matchPattern(value, REGEX_PATTERNS.ipv6)

/** MAC 地址判据 */
export const isMac = (value: unknown): boolean => matchPattern(value, REGEX_PATTERNS.mac)

/** 端口号判据 */
export const isPort = (value: unknown): boolean => matchPattern(value, REGEX_PATTERNS.port)

/** 手机号判据 */
export const isPhone = (value: unknown): boolean => matchPattern(value, REGEX_PATTERNS.phone)

/** 邮箱判据 */
export const isEmail = (value: unknown): boolean => matchPattern(value, REGEX_PATTERNS.email)

/** URL 判据 */
export const isUrl = (value: unknown): boolean => matchPattern(value, REGEX_PATTERNS.url)

/** 正则类判据表：按 type 取值级判据（内核与适配器共用） */
export const REGEX_PREDICATES = {
  ipv4: isIpv4,
  ipv6: isIpv6,
  mac: isMac,
  port: isPort,
  phone: isPhone,
  email: isEmail,
  url: isUrl,
} as const
