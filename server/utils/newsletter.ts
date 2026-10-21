import { createHash, randomBytes } from 'node:crypto';
export const tokenHash = (value: string) => createHash('sha256').update(value).digest('hex');
export const newToken = () => randomBytes(32).toString('hex');
export const tokenPattern = /^[a-f0-9]{64}$/;
