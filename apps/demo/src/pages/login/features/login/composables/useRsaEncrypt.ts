import JSEncrypt from 'jsencrypt';
import { COPY } from '@/shared/constants/copy';

// 生产公钥应从后端运行时获取（如 GET /auth/public-key），不得硬编码写死（会过期）。
// DEV 环境（mock 登录）无公钥时允许明文直传；生产环境缺公钥是配置错误，必须抛错拒绝登录，
// 绝不能静默降级为明文密码发出（安全底线，审查 P0 #3）。
// 注意：公钥在函数内惰性读取 import.meta.env，便于测试通过 stubEnv 覆盖。
function getPublicKey(): string {
  return import.meta.env.VITE_RSA_PUBLIC_KEY ?? '';
}

export function useRsaEncrypt() {
  function encryptPassword(password: string): string {
    const publicKey = getPublicKey();
    if (!publicKey) {
      // DEV（mock 阶段）无公钥：直接返回原文，方便本地联调。
      // 生产（!DEV）无公钥：拒绝继续，抛错由登录表单呈现，防止明文密码进请求体。
      if (!import.meta.env.DEV) {
        throw new Error(COPY.LOGIN.ENCRYPT_FAILED);
      }
      return password;
    }
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(password);
    if (!encrypted) {
      throw new Error(COPY.LOGIN.ENCRYPT_FAILED);
    }
    return encrypted;
  }

  return { encryptPassword };
}
