/** A small, deterministic job scheduler and per-run event ledger. */

export interface Job {
  readonly id: string;
  readonly availableAtMs: number;
  readonly expiresAtMs: number;
  readonly priority: number;
  readonly createdAtMs: number;
}

export interface RunEvent {
  readonly runId: string;
  readonly eventId: string;
  readonly kind: string;
  readonly atMs: number;
}

/** A job is expired at its deadline, not only after the deadline. */
export function isExpired(job: Job, nowMs: number): boolean {
  return nowMs >= job.expiresAtMs;
}

/**
 * Select one runnable job without mutating the input.
 * Higher numeric priority wins; equal priorities are FIFO by creation time.
 * Use the ID as a deterministic final tie-breaker.
 */
export function pickNextJob(jobs: readonly Job[], nowMs: number): Job | undefined {
  return jobs
    .filter((job) => job.availableAtMs <= nowMs && !isExpired(job, nowMs))
    .slice()
    .sort(
      (a, b) =>
        b.priority - a.priority ||
        a.createdAtMs - b.createdAtMs ||
        a.id.localeCompare(b.id),
    )[0];
}

/**
 * Append an event unless the same eventId has already appeared in the same run.
 * The caller's event list must not be mutated.
 */
export function appendRunEvent(
  events: readonly RunEvent[],
  next: RunEvent,
): readonly RunEvent[] {
  if (
    events.some(
      (event) => event.runId === next.runId && event.eventId === next.eventId,
    )
  ) {
    return events;
  }
  return [...events, next];
}
