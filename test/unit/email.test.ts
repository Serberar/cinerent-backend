import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rentConfirmation } from '../../src/infrastructure/email/templates/rentConfirmation';

test('el título de una película no puede meter HTML en el correo', () => {
  const { html } = rentConfirmation({ movieTitle: '<img src=x onerror=alert(1)>', dias: 1, total: 2 });
  assert.ok(!html.includes('<img'));
  assert.match(html, /&lt;img/);
});
