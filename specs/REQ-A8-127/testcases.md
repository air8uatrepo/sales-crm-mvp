# Test cases: Sales CRM MVP (REQ-A8-127)

Requirement: REQ-A8-127  Run: ec105816-6d88-4d83-b90f-ec6e912f392e
Spec: specs/REQ-A8-127/spec.md (revision 2)

All fixtures and expected values use the synthetic prefix
`DEMO-REQ-A8-127-<run_id>`.

## Unit (vitest) — src/lib/__tests__/repository.test.ts

| Case | Action | Expected |
| --- | --- | --- |
| U-01 | listCustomers with a stub pool | returns rows in `created_at` desc order with ISO-normalized timestamps |
| U-02 | createCustomer | inserts with `status = 'draft'` and returns the row |
| U-03 | updateCustomer on a draft row | issues SQL guarded by `status = 'draft'` and returns the row |
| U-04 | updateCustomer when no matching draft row | returns null (submitted rows are read-only) |
| U-05 | submitCustomer on a draft row | issues `status = 'submitted'` guarded by `status = 'draft'` and returns the row |
| U-06 | submitCustomer when no matching draft row | returns null (already-submitted rows stay submitted) |
| U-07 | getCustomer by id | returns the matching row |
| U-08 | getCustomer for a missing id | returns null |

## Key-path browser E2E (Playwright) — e2e/crm.spec.ts

Runs against a deployed URL (preview/production) or a local loopback URL.

| Case | Action | Expected |
| --- | --- | --- |
| K-01 | Create a draft via `/customers/new` | record appears on `/` in `draft` status |
| K-02 | Open the record and edit it via `/customers/[id]/edit` | edited company name is shown on the detail page |
| K-03 | Submit the draft | detail page shows `submitted` and a read-only notice |
| K-04 | Reload `/` | the submitted record is visible |
| K-05 | Reopen the submitted record | no Edit or Submit controls; read-only |
