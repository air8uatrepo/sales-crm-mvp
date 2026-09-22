import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createCustomer,
  getCustomer,
  listCustomers,
  submitCustomer,
  updateCustomer,
  DatabasePool,
} from "../repository";

// A query double shaped from the driver's real return type: pg returns a `Date`
// for timestamptz, so a string-only double cannot catch the normalizing bug.
const iso = "2026-09-21T09:00:00.000Z";

function rows(...items: Array<Record<string, unknown>>): { rows: Array<Record<string, unknown>> } {
  return { rows: items };
}

function makePool(handler: (sql: string, params: unknown[]) => { rows: Array<Record<string, unknown>> }): DatabasePool {
  return {
    query: vi.fn((sql: string, params: unknown[] = []) => Promise.resolve(handler(sql, params))),
  };
}

function draftRow(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    company_name: "DEMO-REQ-A8-127-acme",
    company_contact: "DEMO-REQ-A8-127-contact",
    buyer_name: "DEMO-REQ-A8-127-buyer",
    bd_email: "DEMO-REQ-A8-127-bd@example.com",
    status: "draft",
    created_at: new Date(iso),
    updated_at: new Date(iso),
    ...overrides,
  };
}

describe("customer repository", () => {
  const originalSchema = process.env.BUSINESS_DIRECT_DATABASE_SCHEMA;

  beforeEach(() => {
    process.env.BUSINESS_DIRECT_DATABASE_SCHEMA = "proto_sales_crm_mvp";
  });

  afterEach(() => {
    if (originalSchema === undefined) {
      delete process.env.BUSINESS_DIRECT_DATABASE_SCHEMA;
    } else {
      process.env.BUSINESS_DIRECT_DATABASE_SCHEMA = originalSchema;
    }
  });

  it("lists customers in descending creation order with ISO-normalized timestamps", async () => {
    const pool = makePool((sql, params) => {
      expect(sql).toContain("proto_sales_crm_mvp.customer_records order by created_at desc");
      expect(params).toEqual([]);
      return rows(draftRow(), draftRow({ id: "22222222-2222-4222-8222-222222222222" }));
    });
    const result = await listCustomers(pool);
    expect(result).toHaveLength(2);
    expect(result[0].created_at).toBe(iso);
    expect(result[0].updated_at).toBe(iso);
    expect(result[0].created_at).toBeTypeOf("string");
  });

  it("creates a customer record with draft status", async () => {
    const pool = makePool((sql, params) => {
      expect(sql).toContain("insert into proto_sales_crm_mvp.customer_records");
      expect(sql).toContain("'draft'");
      expect(params).toEqual([
        "DEMO-REQ-A8-127-acme",
        "DEMO-REQ-A8-127-contact",
        "DEMO-REQ-A8-127-buyer",
        "DEMO-REQ-A8-127-bd@example.com",
      ]);
      return rows(draftRow());
    });
    const result = await createCustomer(
      {
        company_name: "DEMO-REQ-A8-127-acme",
        company_contact: "DEMO-REQ-A8-127-contact",
        buyer_name: "DEMO-REQ-A8-127-buyer",
        bd_email: "DEMO-REQ-A8-127-bd@example.com",
      },
      pool,
    );
    expect(result.status).toBe("draft");
  });

  it("updates only while the record is draft", async () => {
    let sqlSeen = "";
    const pool = makePool((sql, _params) => {
      sqlSeen = sql;
      return rows(draftRow());
    });
    const result = await updateCustomer(
      "11111111-1111-4111-8111-111111111111",
      {
        company_name: "DEMO-REQ-A8-127-acme-2",
        company_contact: "DEMO-REQ-A8-127-contact",
        buyer_name: "DEMO-REQ-A8-127-buyer",
        bd_email: "DEMO-REQ-A8-127-bd@example.com",
      },
      pool,
    );
    expect(sqlSeen).toContain("status = 'draft'");
    expect(result).not.toBeNull();
  });

  it("returns null when updating a submitted (read-only) record", async () => {
    const pool = makePool((_sql, _params) => rows());
    const result = await updateCustomer(
      "11111111-1111-4111-8111-111111111111",
      {
        company_name: "DEMO-REQ-A8-127-acme",
        company_contact: null,
        buyer_name: null,
        bd_email: null,
      },
      pool,
    );
    expect(result).toBeNull();
  });

  it("submits a record only while it is draft", async () => {
    let sqlSeen = "";
    const pool = makePool((sql, _params) => {
      sqlSeen = sql;
      return rows(draftRow({ status: "submitted" }));
    });
    const result = await submitCustomer("11111111-1111-4111-8111-111111111111", pool);
    expect(sqlSeen).toContain("status = 'submitted'");
    expect(sqlSeen).toContain("status = 'draft'");
    expect(result).not.toBeNull();
    expect(result!.status).toBe("submitted");
  });

  it("returns null when submitting an already-submitted record", async () => {
    const pool = makePool((_sql, _params) => rows());
    const result = await submitCustomer("11111111-1111-4111-8111-111111111111", pool);
    expect(result).toBeNull();
  });

  it("fetches a single record by id", async () => {
    const pool = makePool((_sql, params) => {
      expect(params).toEqual(["11111111-1111-4111-8111-111111111111"]);
      return rows(draftRow());
    });
    const result = await getCustomer("11111111-1111-4111-8111-111111111111", pool);
    expect(result).not.toBeNull();
    expect(result!.id).toBe("11111111-1111-4111-8111-111111111111");
  });

  it("returns null when a record is not found", async () => {
    const pool = makePool((_sql, _params) => rows());
    expect(await getCustomer("missing", pool)).toBeNull();
  });
});

