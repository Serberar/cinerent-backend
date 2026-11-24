const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SRC = path.join(__dirname, '../../src');
const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (
  entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]
));
const imports = (file) => [...fs.readFileSync(file, 'utf8').matchAll(/require\(['"`]([^'"`]+)/g)].map((m) => m[1]);

test('el dominio no depende de ninguna otra capa ni librería', () => {
  for (const file of files(path.join(SRC, 'domain'))) {
    for (const name of imports(file)) assert.ok(name === 'crypto' || name.startsWith('./'), `${file} importa ${name}`);
  }
});

test('la aplicación solo depende del dominio', () => {
  for (const file of files(path.join(SRC, 'application'))) {
    for (const name of imports(file)) {
      assert.ok(name.includes('/domain/') || name.startsWith('./use-cases/'), `${file} importa ${name}`);
    }
  }
});
