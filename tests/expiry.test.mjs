import assert from 'node:assert/strict';
import test from 'node:test';
import { isExpired } from '../src/index.ts';

const job = {
  id: 'A', availableAtMs: 0, expiresAtMs: 1_000,
  priority: 1, createdAtMs: 0,
};

test('expiry: not expired before the deadline', () => {
  assert.equal(isExpired(job, 999), false);
});

test('expiry: expired exactly at the deadline', () => {
  assert.equal(isExpired(job, 1_000), true);
});

test('expiry: expired after the deadline', () => {
  assert.equal(isExpired(job, 1_001), true);
});
