import { getCustomer } from "@/lib/repository";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubmitButton from "./SubmitButton";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const record = await getCustomer(id);
  if (!record) {
    notFound();
    return null;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-zinc-600 hover:underline">
        &larr; Back to list
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">{record.company_name}</h1>
      <dl className="mt-4 grid grid-cols-1 gap-3">
        <div>
          <dt className="text-sm font-medium text-zinc-600">Company contact</dt>
          <dd className="text-zinc-900">{record.company_contact ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-600">Cooperating buyer</dt>
          <dd className="text-zinc-900">{record.buyer_name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-600">BD email</dt>
          <dd className="text-zinc-900">{record.bd_email ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-600">Status</dt>
          <dd>
            <span
              className={
                record.status === "submitted"
                  ? "rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                  : "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
              }
            >
              {record.status}
            </span>
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex gap-3">
        {record.status === "draft" ? (
          <>
            <Link
              href={`/customers/${record.id}/edit`}
              className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Edit
            </Link>
            <SubmitButton id={record.id} />
          </>
        ) : (
          <p className="text-sm text-zinc-600">
            This record has been submitted and is read-only.
          </p>
        )}
      </div>
    </section>
  );
}
