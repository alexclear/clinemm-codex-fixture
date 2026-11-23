import assert from 'node:assert/strict';
import test from 'node:test';
import { appendRunEvent } from '../src/index.ts';

function event(runId, eventId, kind = 'progress') {
  return { runId, eventId, kind, atMs: 123 };
}

test('events: a new event appends without mutating the original list', () => {
  const original = Object.freeze([event('run-A', 'event-1')]);
  const result = appendRunEvent(original, event('run-A', 'event-2'));
  assert.deepEqual(result.map((item) => item.eventId), ['event-1', 'event-2']);
  assert.equal(original.length, 1);
});

test('events: replay in the same run is idempotent', () => {
  const first = event('run-A', 'event-1');
  const original = [first];
  assert.strictEqual(appendRunEvent(original, first), original);
});

test('events: event IDs are scoped to their run', () => {
  const original = [event('run-A', 'event-1')];
  const result = appendRunEvent(original, event('run-B', 'event-1'));
  assert.deepEqual(result.map((item) => item.runId), ['run-A', 'run-B']);
});
