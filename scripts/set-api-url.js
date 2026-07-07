const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL;
const target = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

if (!apiUrl) {
  console.warn('[set-api-url] API_URL env var not set, keeping existing environment.prod.ts value');
  process.exit(0);
}

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(target, content);
console.log(`[set-api-url] environment.prod.ts apiUrl set to ${apiUrl}`);
