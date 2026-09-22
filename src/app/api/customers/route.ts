import { NextResponse } from "next/server";
import { createCustomer, listCustomers } from "../../../lib/repository";
import { customerInputSchema } from "./schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await listCustomers();
    return NextResponse.json({ records });
  } catch (err) {
    console.error("list customers failed", err);
    return NextResponse.json({ error: "list failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = customerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const record = await createCustomer({
    company_name: input.company_name,
    company_contact: input.company_contact ?? null,
    buyer_name: input.buyer_name ?? null,
    bd_email: input.bd_email ?? null,
  });

  return NextResponse.json({ record }, { status: 201 });
}
