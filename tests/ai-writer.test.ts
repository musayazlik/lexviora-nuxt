import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { WriteRequest } from '../server/utils/ai-writer';
const calls: any[] = [];
let noSources = false,
  short = false,
  writingCalls = 0;
const content = Array.from(
  { length: 5 },
  (_, i) => `## Section ${i + 1}\n\nVerified information [${(i % 3) + 1}].`,
).join('\n\n');
const server = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/models')
    return res.end(
      JSON.stringify({
        data: [
          {
            id: 'test/writer',
            name: 'Writer',
            context_length: 128000,
            pricing: { prompt: '0.000001', completion: '0.000002' },
            architecture: { output_modalities: ['text'] },
          },
          {
            id: 'test/image',
            name: 'Image',
            architecture: { output_modalities: ['text', 'image'] },
          },
        ],
      }),
    );
  let raw = '';
  for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw);
  calls.push(body);
  const researching = body.model === 'perplexity/sonar-pro';
  if (!researching) writingCalls++;
  res.end(
    JSON.stringify({
      choices: [
        {
          message: {
            content: researching
              ? 'Research findings [1]. More facts [2]. Context [3].'
              : JSON.stringify({
                  title: 'A careful legal perspective',
                  description: 'A useful summary [1].',
                  content: short && writingCalls === 1 ? '## One section\nToo short.' : content,
                  category: 'Legal insights',
                  tags: ['law'],
                  imagePrompts: ['A calm law library', 'An architectural detail'],
                }),
            annotations:
              researching && !noSources
                ? [1, 2, 3].map((n) => ({
                    url_citation: {
                      url: `https://authority.example/source-${n}`,
                      title: `Primary source ${n}`,
                    },
                  }))
                : [],
          },
        },
      ],
    }),
  );
});
let writer: typeof import('../server/utils/ai-writer'),
  router: typeof import('../server/utils/openrouter');
before(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as { port: number };
  process.env.OPENROUTER_BASE_URL = `http://127.0.0.1:${address.port}`;
  process.env.OPENROUTER_API_KEY = 'test-only';
  writer = await import('../server/utils/ai-writer');
  router = await import('../server/utils/openrouter');
});
after(() => {
  server.closeAllConnections();
  server.close();
});
const request: WriteRequest = {
  topic: 'A legal information article',
  language: 'tr',
  style: 'informative',
  depth: 'standard',
  webSearch: true,
  model: 'test/writer',
  categories: [],
  tags: [],
  fields: {
    title: true,
    description: true,
    content: true,
    contentImages: true,
    category: true,
    tags: true,
  },
};
test('model catalog separates image outputs and converts prices', async () => {
  const models = await router.listTextAndImageModels();
  assert.equal(models.text[0]?.id, 'test/writer');
  assert.equal(models.text[0]?.priceIn, 1);
  assert.equal(models.image[0]?.id, 'test/image');
});
test('research runs before writing and produces a numbered bibliography', async () => {
  calls.length = 0;
  const result = await writer.writePost(request);
  assert.equal(calls[0].model, 'perplexity/sonar-pro');
  assert.equal(calls[0].plugins, undefined);
  assert.equal(calls[1].model, 'test/writer');
  assert.ok(calls[1].messages[1].content.includes('Research notes:'));
  assert.equal(result.sources.length, 3);
  assert.ok(result.content?.includes('## Kaynakça'));
  assert.ok(result.content?.includes('https://authority.example/source-1'));
  assert.equal(result.description?.includes('[1]'), false);
  assert.equal(result.imagePrompts.length, 2);
});
test('research without sources fails before any writing request', async () => {
  noSources = true;
  calls.length = 0;
  try {
    await assert.rejects(writer.writePost(request), /no sources/);
    assert.equal(calls.length, 1);
  } finally {
    noSources = false;
  }
});
test('an undersized article is retried once, and inline images respect section boundaries', async () => {
  short = true;
  writingCalls = 0;
  try {
    const result = await writer.writePost({ ...request, webSearch: false, language: 'ja' });
    assert.equal(writingCalls, 2);
    assert.equal(writer.countSubheadings(result.content!), 5);
    const markdown = writer.insertInlineImages(result.content!, [
      { url: 'https://example.test/a.webp', alt: 'Law library' },
    ]);
    assert.ok(markdown.indexOf('a.webp') > markdown.indexOf('## Section 1'));
    assert.ok(markdown.indexOf('a.webp') < markdown.indexOf('## Section 2'));
    assert.ok(writer.markdownToHtml(markdown).includes('<h2>'));
  } finally {
    short = false;
  }
});
test('cancellation aborts provider requests', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(writer.writePost(request, controller.signal));
});
