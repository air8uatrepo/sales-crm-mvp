// Server-only Postgres access through the pooled least-privilege connection.
// Never import this module from a client component; it reads the server-only
// connector string and would leak it into the browser bundle.
//
// Runtime rule from the workflow contract: pg returns a `Date` for timestamptz
// columns, so every timestamp read is normalized to an ISO string here at the
// repository boundary before the UI renders it.
//
// The pool is injectable so the repository boundary can be unit-tested without
// a live connection; callers that pass none use the pooled least-privilege
// connection string below.
import Pool from "pg-pool";

export type DatabasePool = {
  query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
};

export type CustomerRecord = {
  id: string;
  company_name: string;
  company_contact: string | null;
  buyer_name: string | null;
  bd_email: string | null;
  status: "draft" | "submitted";
  created_at: string;
  updated_at: string;
};

let pool: DatabasePool | null = null;

function getPool(): DatabasePool {
  if (pool) return pool;
  const connectionString = process.env.BUSINESS_DIRECT_DATABASE_URL;
  if (!connectionString) {
    throw new Error("BUSINESS_DIRECT_DATABASE_URL is not configured");
  }
  const instance: DatabasePool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
  }) as unknown as DatabasePool;
  pool = instance;
  return pool;
}

function schema(): string {
  return process.env.BUSINESS_DIRECT_DATABASE_SCHEMA ?? "app_sales_crm_mvp";
}

function toRecord(row: Record<string, unknown>): CustomerRecord {
  return {
    id: String(row.id),
    company_name: String(row.company_name),
    company_contact: row.company_contact == null ? null : String(row.company_contact),
    buyer_name: row.buyer_name == null ? null : String(row.buyer_name),
    bd_email: row.bd_email == null ? null : String(row.bd_email),
    status: String(row.status) === "submitted" ? "submitted" : "draft",
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  };
}

export async function listCustomers(overridePool?: DatabasePool): Promise<CustomerRecord[]> {
  const sql = "select * from " + schema() + ".customer_records order by created_at desc";
  const res = await (overridePool ?? getPool()).query(sql);
  return res.rows.map(toRecord);
}

export async function getCustomer(id: string, overridePool?: DatabasePool): Promise<CustomerRecord | null> {
  const sql = "select * from " + schema() + ".customer_records where id = $1";
  const res = await (overridePool ?? getPool()).query(sql, [id]);
  if (res.rows.length === 0) return null;
  return toRecord(res.rows[0]);
}

export type CreateInput = {
  company_name: string;
  company_contact: string | null;
  buyer_name: string | null;
  bd_email: string | null;
};

export async function createCustomer(
  input: CreateInput,
  overridePool?: DatabasePool,
): Promise<CustomerRecord> {
  const sql =
    "insert into " + schema() + ".customer_records " +
    "(company_name, company_contact, buyer_name, bd_email, status) " +
    "values ($1, $2, $3, $4, 'draft') returning *";
  const res = await (overridePool ?? getPool()).query(sql, [
    input.company_name,
    input.company_contact,
    input.buyer_name,
    input.bd_email,
  ]);
  return toRecord(res.rows[0]);
}

export type UpdateInput = CreateInput;

export async function updateCustomer(
  id: string,
  input: UpdateInput,
  overridePool?: DatabasePool,
): Promise<CustomerRecord | null> {
  const sql =
    "update " + schema() + ".customer_records " +
    "set company_name = $2, company_contact = $3, buyer_name = $4, bd_email = $5, " +
    "updated_at = now() where id = $1 and status = 'draft' returning *";
  const res = await (overridePool ?? getPool()).query(sql, [
    id,
    input.company_name,
    input.company_contact,
    input.buyer_name,
    input.bd_email,
  ]);
  if (res.rows.length === 0) return null;
  return toRecord(res.rows[0]);
}

export async function submitCustomer(
  id: string,
  overridePool?: DatabasePool,
): Promise<CustomerRecord | null> {
  const sql =
    "update " + schema() + ".customer_records " +
    "set status = 'submitted', updated_at = now() where id = $1 and status = 'draft' returning *";
  const res = await (overridePool ?? getPool()).query(sql, [id]);
  if (res.rows.length === 0) return null;
  return toRecord(res.rows[0]);
}
