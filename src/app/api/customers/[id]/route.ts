import { NextResponse } from "next/server";
import { getCustomer, updateCustomer } from "../../../../lib/repository";
import { customerInputSchema } from "../schema";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const record = await getCustomer(id);
  if (!record) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ record });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

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
  const record = await updateCustomer(id, {
    company_name: input.company_name,
    company_contact: input.company_contact ?? null,
    buyer_name: input.buyer_name ?? null,
    bd_email: input.bd_email ?? null,
  });

  if (!record) {
    return NextResponse.json({ error: "not editable (submitted) or missing" }, { status: 409 });
  }
  return NextResponse.json({ record });
}
