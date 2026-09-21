# REQ-A8-127 outbound ledger

<!--
Append-only. One row per outbound Linear item. Never rewrite or reorder a row.
-->

| Outbound item | Kind | Target | Revision | Idempotency key | Readback |
| --- | --- | --- | --- | --- | --- |
| spec-child-sync-REQ-A8-127 | spec_child_sync | Linear issue A8-128 (93e53960-6199-4c9b-9176-8ea4d07cae68) | 2 | `bd-spec-child-ec105816-6d88-4d83-b90f-ec6e912f392e-r2` | A8-128 description read back with revision 2 marker; updatedAt 2026-09-21T19:00:45.245Z |
| spec-child-state-REQ-A8-127 | state_mirror | Linear issue A8-128 (spec child only) | 2 | `bd-spec-child-state-ec105816-6d88-4d83-b90f-ec6e912f392e-r2` | A8-128 status Requirement Done; completedAt 2026-09-21T18:59:43.863Z |

## Kinds

- `spec_child_sync` - the Requirement Spec child description replaced in full
  with the current `spec.md`.
- `state_mirror` - a milestone state write. This row is the Requirement Spec
  child's own completion; the main issue A8-127 was not moved.