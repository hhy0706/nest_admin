import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { create as createCaptcha } from 'svg-captcha';
import * as bcrypt from 'bcrypt';


// 生成哈希密码
export async function hashPassword(password) {
  const saltRounds = 10; // 定义盐的迭代次数
  try {
    // 生成盐值
    const salt = await bcrypt.genSalt(saltRounds);
    // 使用盐值和密码生成哈希值
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('生成哈希密码时出错:', error);
    throw error;
  }
}

// 验证哈希密码
export async function verifyPassword(password, hashedPassword) {
  try {
    // 比较密码和哈希值
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('验证哈希密码时出错:', error);
    throw error;
  }
}

export function generateCaptcha() {
  const captcha = createCaptcha();
  const uuidValue = GenerateUUID(); // 生成一个 UUID

  return {
    uuid: uuidValue,
    data: captcha.data, // 验证码的 SVG 数据
    text: captcha.text // 验证码的文本
  };
}
/**
 * 获取当前时间
 * YYYY-MM-DD HH:mm:ss
 * @returns
 */
export function GetNowDate() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}
/**
 * 生成唯一id
 * UUID
 * @returns
 */
export function GenerateUUID(): string {
    const uuid = uuidv4();
    return uuid.replaceAll('-', '');
  }