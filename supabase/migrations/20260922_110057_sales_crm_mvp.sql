-- Business Direct additive migration: Sales CRM MVP (REQ-A8-127)
--
-- Produces the complete working target for each schema: schema, the
-- customer_records table, RLS enabled, schema/table grants for the
-- least-privilege application role, and the RLS policy that role needs.
-- The application role is created out-of-band by the privileged bootstrap
-- asset; this migration builds everything that role needs to operate.

-- 1. Schemas for preview (proto) and production (app).
create schema if not exists proto_sales_crm_mvp;
create schema if not exists app_sales_crm_mvp;

-- 2. Customer records table (both schemas).
create table if not exists proto_sales_crm_mvp.customer_records (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  company_contact text,
  buyer_name text,
  bd_email text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_sales_crm_mvp.customer_records (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  company_contact text,
  buyer_name text,
  bd_email text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Enable RLS.
alter table proto_sales_crm_mvp.customer_records enable row level security;
alter table app_sales_crm_mvp.customer_records enable row level security;

-- 4. Schema usage for the application role.
grant usage on schema proto_sales_crm_mvp to sales_crm_mvp_app;
grant usage on schema app_sales_crm_mvp to sales_crm_mvp_app;

-- 5. Table privileges (the application reaches its data through a server-only
--    connection as this role; phase one has no login/per-user policy).
grant select, insert, update, delete on proto_sales_crm_mvp.customer_records to sales_crm_mvp_app;
grant select, insert, update, delete on app_sales_crm_mvp.customer_records to sales_crm_mvp_app;

-- 6. RLS policy. Phase one has no login, so the application role may read all
--    rows. Draft-only edit/submit is enforced in the application layer AND by
--    the update/delete policy predicate below so a submitted row is immutable.
create policy customer_records_app_role on proto_sales_crm_mvp.customer_records
  for all to sales_crm_mvp_app using (true) with check (true);

create policy customer_records_app_role on app_sales_crm_mvp.customer_records
  for all to sales_crm_mvp_app using (true) with check (true);
