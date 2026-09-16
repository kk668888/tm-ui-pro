// packages/ui/src/validation/__tests__/predicates.spec.ts
// 判据内核单测：每个判据的正例 / 反例 / 边界值
// 测试向量说明：idCard 用 GB 11643-1999 附录 A 的标准示例；creditCode 用公开资料广泛引用的合法代码
import { describe, it, expect } from 'vitest'
import {
  isIpv4,
  isIpv6,
  isMac,
  isPort,
  isPhone,
  isEmail,
  isUrl,
  isIdCard,
  isCreditCode,
  isInRange,
  isLengthWithin,
} from '../predicates'

describe('regex 判据：ipv4', () => {
  it('合法地址通过（含 0、255 边界与前导零）', () => {
    expect(isIpv4('192.168.1.1')).toBe(true)
    expect(isIpv4('0.0.0.0')).toBe(true)
    expect(isIpv4('255.255.255.255')).toBe(true)
    expect(isIpv4('192.168.001.001')).toBe(true)
  })

  it('非法地址不通过（越界 / 段数错误 / 非数字）', () => {
    expect(isIpv4('256.1.1.1')).toBe(false)
    expect(isIpv4('1.2.3')).toBe(false)
    expect(isIpv4('1.2.3.4.5')).toBe(false)
    expect(isIpv4('a.b.c.d')).toBe(false)
    expect(isIpv4('')).toBe(false)
    expect(isIpv4(undefined)).toBe(false)
  })
})

describe('regex 判据：ipv6', () => {
  it('合法地址通过（完整 8 组、:: 压缩、纯 ::）', () => {
    expect(isIpv6('1:2:3:4:5:6:7:8')).toBe(true)
    expect(isIpv6('::1')).toBe(true)
    expect(isIpv6('::')).toBe(true)
    expect(isIpv6('fe80::1')).toBe(true)
    expect(isIpv6('2001:db8::8:800:200c:417a')).toBe(true)
  })

  it('非法地址不通过（组数不足 / 组超长 / 越界组数 / IPv4 不混入）', () => {
    expect(isIpv6('1:2:3:4:5:6:7')).toBe(false)
    expect(isIpv6('12345::')).toBe(false)
    expect(isIpv6('1:2:3:4:5:6:7:8:9')).toBe(false)
    expect(isIpv6('1.2.3.4')).toBe(false)
    expect(isIpv6('192.168.1.1')).toBe(false)
  })
})

describe('regex 判据：mac', () => {
  it('合法地址通过（冒号 / 连字符）', () => {
    expect(isMac('AA:BB:CC:DD:EE:FF')).toBe(true)
    expect(isMac('aa-bb-cc-dd-ee-ff')).toBe(true)
    expect(isMac('00:1A:2b:3C:4d:5E')).toBe(true)
  })

  it('非法地址不通过（混用分隔符 / 组数不足 / 非十六进制）', () => {
    expect(isMac('AA:BB-CC:DD:EE:FF')).toBe(false)
    expect(isMac('AA:BB:CC:DD:EE')).toBe(false)
    expect(isMac('GG:BB:CC:DD:EE:FF')).toBe(false)
    expect(isMac('')).toBe(false)
  })
})

describe('regex 判据：port', () => {
  it('0-65535 边界全部通过', () => {
    expect(isPort('0')).toBe(true)
    expect(isPort('80')).toBe(true)
    expect(isPort('8080')).toBe(true)
    expect(isPort('65535')).toBe(true)
    expect(isPort(8080)).toBe(true)
  })

  it('越界与非数字不通过', () => {
    expect(isPort('65536')).toBe(false)
    expect(isPort('-1')).toBe(false)
    expect(isPort('abc')).toBe(false)
    expect(isPort('')).toBe(false)
  })
})

describe('regex 判据：phone', () => {
  it('合法手机号通过（第二位 3-9、11 位）', () => {
    expect(isPhone('13800138000')).toBe(true)
    expect(isPhone('19912345678')).toBe(true)
  })

  it('非法手机号不通过（第二位越界 / 位数不足 / 非 1 开头）', () => {
    expect(isPhone('12345678901')).toBe(false)
    expect(isPhone('1380013800')).toBe(false)
    expect(isPhone('23800138000')).toBe(false)
    expect(isPhone('138001380001')).toBe(false)
  })
})

describe('regex 判据：email', () => {
  it('常规邮箱通过', () => {
    expect(isEmail('user@example.com')).toBe(true)
    expect(isEmail('first.last@sub.example.co')).toBe(true)
  })

  it('缺域名后缀 / 含空白 / 缺本地部分不通过', () => {
    expect(isEmail('user@example')).toBe(false)
    expect(isEmail('a b@example.com')).toBe(false)
    expect(isEmail('@example.com')).toBe(false)
  })
})

describe('regex 判据：url', () => {
  it('http/https 地址通过（含 localhost、端口、查询参数）', () => {
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('http://localhost:3000/x?y=1')).toBe(true)
    expect(isUrl('https://a.b.example.co/path#anchor')).toBe(true)
  })

  it('非 http(s) 协议 / 缺协议 / 无域名点号不通过', () => {
    expect(isUrl('ftp://example.com')).toBe(false)
    expect(isUrl('example.com')).toBe(false)
    expect(isUrl('https://a')).toBe(false)
  })
})

describe('compare 判据：range（数值闭区间）', () => {
  it('区间内通过（含边界），区间外不通过', () => {
    expect(isInRange(1, 1, 100)).toBe(true)
    expect(isInRange(100, 1, 100)).toBe(true)
    expect(isInRange(50, 1, 100)).toBe(true)
    expect(isInRange(0, 1, 100)).toBe(false)
    expect(isInRange(101, 1, 100)).toBe(false)
  })

  it('数字串宽容转换；非数值不通过', () => {
    expect(isInRange('50', 1, 100)).toBe(true)
    expect(isInRange('abc', 1, 100)).toBe(false)
  })
})

describe('compare 判据：length（长度闭区间）', () => {
  it('区间内通过（含边界），区间外不通过', () => {
    expect(isLengthWithin('ab', 2, 20)).toBe(true)
    expect(isLengthWithin('a'.repeat(20), 2, 20)).toBe(true)
    expect(isLengthWithin('a', 2, 20)).toBe(false)
    expect(isLengthWithin('a'.repeat(21), 2, 20)).toBe(false)
  })

  it('非字符串不通过', () => {
    expect(isLengthWithin(12345, 2, 20)).toBe(false)
    expect(isLengthWithin(undefined, 2, 20)).toBe(false)
  })
})

describe('checksum 判据：idCard（GB 11643 完整校验位）', () => {
  it('校验位正确的号码通过（GB 11643-1999 附录 A 标准示例，兼容小写 x）', () => {
    expect(isIdCard('11010519491231002X')).toBe(true)
    expect(isIdCard('11010519491231002x')).toBe(true)
  })

  it('仅校验位错误即不通过（格式合法也拦下）', () => {
    expect(isIdCard('110105194912310021')).toBe(false)
  })

  it('格式不合法不通过（位数不足 / 含非法字符）', () => {
    expect(isIdCard('110105194912310')).toBe(false)
    expect(isIdCard('11010519491231002AB')).toBe(false)
    expect(isIdCard(11010519491231002)).toBe(false)
  })
})

describe('checksum 判据：creditCode（GB 32100 完整校验码）', () => {
  it('校验码正确的代码通过（公开资料广泛引用的合法示例）', () => {
    expect(isCreditCode('91350100M000100Y43')).toBe(true)
  })

  it('仅校验码错误即不通过', () => {
    expect(isCreditCode('91350100M000100Y44')).toBe(false)
  })

  it('格式不合法不通过（含被排除字母 I/O/S/V/Z、小写、位数不足）', () => {
    expect(isCreditCode('91350100M000100Y4I')).toBe(false)
    expect(isCreditCode('91350100m000100y43')).toBe(false)
    expect(isCreditCode('91350100M000100Y4')).toBe(false)
  })
})
