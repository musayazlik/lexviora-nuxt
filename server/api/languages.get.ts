import { listLanguages } from '../utils/languages';
export default defineEventHandler(async () =>
  (await listLanguages()).filter((language) => language.enabled),
);
