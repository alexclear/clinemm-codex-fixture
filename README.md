# ClineMM × Codex: three-bug TypeScript fixture

**Purpose:** a deliberately small public regression fixture for measuring whether
Codex can supervise a *real* ClineMM coding task. The initial `main` branch is
**intentionally RED**. Do not fix it when publishing the fixture.

No application dependencies, network calls, test libraries, or build step.
Uses Node.js `node:test` and TypeScript type stripping (Node >=22.6).

## Get the baseline

```sh
node --version             # Node >=22.6
npm test                   # expected: 7 PASS, 3 FAIL, exit 1
```

Optional, if TypeScript is installed:

```sh
tsc --noEmit               # source must typecheck before and after repair
```

## Public API contract

- `isExpired(job, nowMs)` returns true starting **at** `expiresAtMs`.
- `pickNextJob(jobs, nowMs)` returns one available, unexpired job. Highest
  numeric priority wins; equal priorities are FIFO by `createdAtMs`, then ID.
  Selection must not mutate `jobs`.
- `appendRunEvent(events, next)` is idempotent for the pair `(runId, eventId)`.
  The same `eventId` in a *different* run must still be appended. Never mutate
  the input list.

## Agent task contract

> Fix the three incorrect behaviors exhibited by the existing tests in this
> small TypeScript project. Keep the public API and already-passing tests
> unchanged. Modify only files under `src/` using ClineMM's native `editor`
> tool. Use shell commands only for inspection and executing tests.
> Do not modify `tests/`, `package.json`, or `README.md`. Run the focused tests,
> demonstrate RED → GREEN, and finish promptly. Avoid repository-wide
> inspection and speculative refactoring. If blocked, report the precise
> blocker and stop.

## Expected acceptance evidence

1. Record initial commit (`git rev-parse HEAD`) and a clean working tree.
2. Record baseline failure: exactly three behavioral failures.
3. Run ClineMM through Codex's MCP control plane; preserve session and event IDs.
4. Prove all tests are GREEN after the repair (`npm test`: 10 PASS, 0 FAIL).
5. Check `git diff --name-only` contains **only `src/`**.
6. Require an independently observed terminal state, not only an agent claim.

An agent that only reports `Complete`, fixes the tests, or skips independent
verification has **not** passed this harness experiment.

## Reset for another attempt

From a fresh clone, create a separate worktree or branch for each attempt.
Avoid fixing the public `main` branch: it is the permanent RED baseline.

## Safety

Use a disposable workspace with no secrets, production credentials, shared
memory index, or unrelated repositories accessible to the coding agent.

## License

MIT. See [LICENSE](LICENSE).
