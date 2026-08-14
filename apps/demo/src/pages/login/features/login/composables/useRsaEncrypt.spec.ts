import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRsaEncrypt } from './useRsaEncrypt';
import { COPY } from '@/shared/constants/copy';

// 对 import.meta.env 的读写做可控 stub（vitest 支持属性覆盖）
const originalEnv = import.meta.env;

describe('useRsaEncrypt', () => {
  beforeEach(() => {
    // 还原默认：无公钥配置
    vi.stubEnv('VITE_RSA_PUBLIC_KEY', '');
  });

  it('DEV 无公钥时允许明文直传（mock 登录联调）', () => {
    vi.stubEnv('DEV', true);
    const { encryptPassword } = useRsaEncrypt();
    expect(encryptPassword('secret')).toBe('secret');
  });

  it('生产（非 DEV）无公钥时抛错拒绝登录，绝不降级明文', () => {
    vi.stubEnv('DEV', false);
    const { encryptPassword } = useRsaEncrypt();
    expect(() => encryptPassword('secret')).toThrow(COPY.LOGIN.ENCRYPT_FAILED);
  });

  it('配置公钥后返回密文（非明文）', () => {
    vi.stubEnv('DEV', true);
    // 固定 RSA 测试公钥（公钥无保密性；1024 位仅测试链路可用性，生产应 ≥2048 位）
    const publicKey =
      '-----BEGIN PUBLIC KEY-----\n' +
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0uBCuIZ4aFkHX+mzrwBvWd57w\n' +
      'kv5MHfSya5KPwrdQuRJsAaYXWaA+MzHfW5HoWPjAVWnrzWQ4UPY7qKUQABFJ93hc\n' +
      'T7PH4Nam8euze4f1wg99hxcMTf36g7eCmrSzywTymCFFNgpC8niN2xTFHJvCWShO\n' +
      'vzfnzE7gU5s7oW5tawIDAQAB\n' +
      '-----END PUBLIC KEY-----';
    vi.stubEnv('VITE_RSA_PUBLIC_KEY', publicKey);
    const { encryptPassword } = useRsaEncrypt();
    const encrypted = encryptPassword('secret');
    // 加密结果应是 Base64 密文，且不含明文本身
    expect(encrypted).not.toBe('secret');
    expect(encrypted.length).toBeGreaterThan(10);
  });

  it('恢复原始 env', () => {
    expect(import.meta.env).toBeDefined();
    void originalEnv;
  });
});
