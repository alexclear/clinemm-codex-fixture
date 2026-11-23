import assert from 'node:assert/strict';
import test from 'node:test';
import { pickNextJob } from '../src/index.ts';

function job(id, overrides = {}) {
  return {
    id, availableAtMs: 0, expiresAtMs: 1_000,
    priority: 1, createdAtMs: 0, ...overrides,
  };
}

test('scheduling: empty queue returns no job', () => {
  assert.equal(pickNextJob([], 100), undefined);
});

test('scheduling: future and expired jobs are not runnable', () => {
  const jobs = [
    job('future', { availableAtMs: 200 }),
    job('expired', { expiresAtMs: 80 }),
    job('ready'),
  ];
  assert.equal(pickNextJob(jobs, 100)?.id, 'ready');
});

test('scheduling: higher numeric priority is chosen first', () => {
  const jobs = [
    job('low', { priority: 1 }),
    job('high', { priority: 9 }),
  ];
  assert.equal(pickNextJob(jobs, 100)?.id, 'high');
});

test('scheduling: equal priorities preserve FIFO and input order', () => {
  const jobs = [
    job('new', { createdAtMs: 20 }),
    job('old', { createdAtMs: 10 }),
  ];
  assert.equal(pickNextJob(jobs, 100)?.id, 'old');
  assert.deepEqual(jobs.map((item) => item.id), ['new', 'old']);
});
