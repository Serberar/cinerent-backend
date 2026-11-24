import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(__dirname, '../../src');
const files = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (
  entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]
));
const imports = (file: string) => [...fs.readFileSync(file, 'utf8').matchAll(/(?:from|import|require\()\s*['"`]([^'"`]+)/g)].map((m) => m[1] ?? '');

test('el dominio no depende de ninguna otra capa ni librería', () => {
  for (const file of files(path.join(SRC, 'domain'))) {
    for (const name of imports(file)) assert.ok(name === 'node:crypto' || name.startsWith('./'), `${file} importa ${name}`);
  }
});

test('la aplicación solo depende del dominio', () => {
  for (const file of files(path.join(SRC, 'application'))) {
    for (const name of imports(file)) {
      assert.ok(/(^|\/)domain\/|^\.\/|\/ports$|\/formatDate$/.test(name), `${file} importa ${name}`);
    }
  }
});

test('la prueba de arquitectura ve de verdad las importaciones', () => {
  const all = files(SRC).flatMap(imports);
  assert.ok(all.includes('@prisma/client') && all.includes('express'));
});
