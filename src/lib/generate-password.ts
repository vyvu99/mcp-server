import { argon2 } from './argon';

export function generatePassword(
  { hash, length }: { length: number; hash?: boolean } = {
    length: 12,
    hash: true,
  },
) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return hash ? argon2.hash(password) : password;
}
