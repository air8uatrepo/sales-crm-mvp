# Implementation plan: Sales CRM MVP (REQ-A8-127)

Requirement: REQ-A8-127  Run: ec105816-6d88-4d83-b90f-ec6e912f392e
Spec: specs/REQ-A8-127/spec.md (revision 2)

## Stack (from AGENTS.md default, no requirement exception)

- Frontend: Next.js 16 (App Router), React 19, TypeScript
- Backend: Next.js API Routes, Zod for form-data validation
- Database: Supabase (server-only pooled connection, dedicated least-privilege role), RLS
- Deployment: Vercel through .github/workflows/deploy.yml (GitHub Actions)

## Goal

Sales staff can record and review customer information. Phase one contains
customer record entry, submission, and viewing only. No login.

## Data model

customer_records table (schema app_sales_crm_mvp in production,
proto_sales_crm_mvp in preview):

- id uuid PK default gen_random_uuid()
- company_name text not null        (enterprise/company name)
- company_contact text              (company contact details)
- buyer_name text                   (cooperating buyer)
- bd_email text                     (BD's own email)
- status text not null default 'draft'  (draft | submitted)
- created_at timestamptz default now()
- updated_at timestamptz default now()

Rules:
- A draft record may be edited; a submitted record is read-only.
- RLS enabled. Phase one has no login, so RLS policy permits the application
  role to insert/select all rows. Updates allowed only while status = 'draft'.

## API surface (Next.js App Router route handlers)

- GET  /api/customers             -> list all customer records
- POST /api/customers             -> create a draft customer record
- GET  /api/customers/[id]        -> single record
- PATCH /api/customers/[id]       -> update only while status = 'draft'
- POST /api/customers/[id]/submit -> set status = 'submitted'

All bodies validated with Zod. All persistence via the server-only Supabase
client using the least-privilege role.

## UI (App Router pages)

- /                 customer list: enterprise name, contact, buyer, BD email, status; link to view
- /customers/new    create form (draft)
- /customers/[id]   view record; edit button when draft; submit button when draft
- /customers/[id]/edit edit form (only when draft; submitted read-only)

All displayed/seed values use DEMO-REQ-A8-127-<run_id> or safe demo data.

## Migration (additive, committed)

supabase/migrations/<ts>_sales_crm_mvp.sql produces for each schema:
schema, customer_records table, RLS enabled, grants for the application role,
and an RLS policy. Manifest at supabase/migrations/manifest.json pins it.

## Verification

- npm test (unit/component)                - green
- npm run lint                             - green
- npm run build                            - green
- npm run test:e2e (Playwright, browser)   - green on deployed preview/production
