import { getPool } from './db';
import { DEFAULT_AI_SETTINGS, type AiSettings } from '../../shared/ai-settings';
export async function getSetting<T extends object>(key: string, fallback: T): Promise<T> {
  const { rows } = await getPool().query('SELECT value FROM app_settings WHERE key = $1', [key]);
  return { ...fallback, ...(rows[0]?.value || {}) };
}
export const getAiSettings = () => getSetting<AiSettings>('ai', DEFAULT_AI_SETTINGS);
export async function saveSetting(key: string, value: unknown) {
  await getPool().query('INSERT INTO app_settings (key,value) VALUES ($1,$2) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value', [key, JSON.stringify(value)]);
}
