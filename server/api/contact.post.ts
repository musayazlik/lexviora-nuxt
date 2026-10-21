import { z } from 'zod';
import { getPool } from '../utils/db';
import { requireContentLanguage } from '../utils/languages';
import {
  plunkConfigured,
  getMailSettings,
  enqueueMail,
  deliverOutbox,
  emailLayout,
  escapeEmail,
} from '../utils/plunk';
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  subject: z.string().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  locale: z.string().max(35),
  website: z.string().max(0).optional(),
});
export default defineEventHandler(async (event) => {
  const origin = getHeader(event, 'origin');
  if (origin && ![process.env.NUXT_PUBLIC_SITE_URL, process.env.BETTER_AUTH_URL].includes(origin))
    throw createError({ statusCode: 403 });
  const value = schema.safeParse(await readBody(event));
  if (!value.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'Please check the form fields and consent.',
    });
  const { name, email, subject, message, locale } = value.data;
  await requireContentLanguage(locale);
  const recent = await getPool().query(
    "SELECT id FROM contact_messages WHERE email = $1 AND created_at > NOW() - INTERVAL '1 minute' LIMIT 1",
    [email],
  );
  if (recent.rowCount)
    throw createError({
      statusCode: 429,
      statusMessage: 'Please wait a minute before sending another message.',
    });
  await getPool().query(
    'INSERT INTO contact_messages (name, email, subject, message, locale) VALUES ($1,$2,$3,$4,$5)',
    [name, email, subject, message, locale],
  );
  if (plunkConfigured()) {
    event.waitUntil(
      (async () => {
        const settings = await getMailSettings();
        const jobs: number[] = [];
        if (settings.notifyContact && settings.contactEmail)
          jobs.push(
            await enqueueMail(
              'contact-notification',
              settings.contactEmail,
              'New enquiry: ' + (subject || name),
              emailLayout(
                'New website enquiry',
                `<p><strong>${escapeEmail(name)}</strong><br>${escapeEmail(email)}</p><p>${escapeEmail(subject || '')}</p><p style="white-space:pre-wrap">${escapeEmail(message)}</p>`,
              ),
              email,
            ),
          );
        if (settings.acknowledgeContact)
          jobs.push(
            await enqueueMail(
              'contact-receipt',
              email,
              locale === 'tr'
                ? 'Mesajınızı aldık | Lexviora'
                : 'We received your message | Lexviora',
              emailLayout(
                locale === 'tr' ? 'Mesajınızı aldık' : 'We received your message',
                `<p>${escapeEmail(name)},</p><p>${locale === 'tr' ? 'Bizimle iletişime geçtiğiniz için teşekkür ederiz. Ekibimiz mesajınızı inceleyip size dönüş yapacaktır.' : 'Thank you for contacting Lexviora. Our team will review your enquiry and get back to you.'}</p>`,
                locale,
              ),
            ),
          );
        await Promise.allSettled(jobs.map(deliverOutbox));
      })(),
    );
  }
  return { success: true };
});
