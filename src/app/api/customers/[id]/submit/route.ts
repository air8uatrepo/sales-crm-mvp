import { NextResponse } from "next/server";
import { submitCustomer } from "../../../../../lib/repository";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const record = await submitCustomer(id);
  if (!record) {
    return NextResponse.json({ error: "not submittable (already submitted) or missing" }, { status: 409 });
  }
  return NextResponse.json({ record });
}
