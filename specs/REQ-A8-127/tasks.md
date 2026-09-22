# Tasks: Sales CRM MVP (REQ-A8-127)

Requirement: REQ-A8-127  Run: ec105816-6d88-4d83-b90f-ec6e912f392e

Each task is behavior-sized, independently verifiable, and linked to an
acceptance criterion in specs/REQ-A8-127/spec.md.

| Task | Description | Acceptance criterion (spec.md) | Verify by |
| --- | --- | --- | --- |
| T-01 | Scaffold Next.js 16 + React 19 + TS app with Supabase server client, Zod, Playwright | whole spec | npm run build / npm test |
| T-02 | Additive Supabase migration for proto_sales_crm_mvp + app_sales_crm_mvp: schema, customer_records table, RLS, grants, policy | migration must produce schema/table/RLS/grants/policy | supabase migration manifest + DB checks |
| T-03 | API GET /api/customers lists customer records | a sales user can view existing customer records | unit test + browser E2E |
| T-04 | API POST /api/customers creates a draft customer record | create a customer record with the four fields then submit | unit test + browser E2E |
| T-05 | API PATCH /api/customers/[id] edits only while draft | a draft record can be edited before submission | unit test + browser E2E |
| T-06 | API POST /api/customers/[id]/submit sets status = submitted | submitted record shows submitted status and is read-only | unit test + browser E2E |
| T-07 | UI: customer list page at / | records visible to sales staff | browser E2E |
| T-08 | UI: create form at /customers/new with company name, contact, buyer, BD email | can enter basic customer information | browser E2E |
| T-09 | UI: view page at /customers/[id] showing fields + status | can view customer information | browser E2E |
| T-10 | UI: edit page at /customers/[id]/edit (draft only) | draft can be edited; submitted read-only | browser E2E |
| T-11 | Key-path Playwright E2E: create draft -> edit -> submit -> list shows submitted -> reopen shows read-only | all acceptance criteria | npm run test:e2e |
