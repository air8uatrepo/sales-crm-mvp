import { getCustomer } from "@/lib/repository";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditCustomerForm from "./EditCustomerForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCustomerPage({ params }: PageProps) {
  const { id } = await params;
  const record = await getCustomer(id);
  if (!record) {
    notFound();
    return null;
  }
  if (record.status !== "draft") {
    return (
      <section className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-zinc-900">
          This record has been submitted and is read-only; it cannot be edited.
        </p>
        <Link href={`/customers/${record.id}`} className="mt-4 inline-block text-sm text-zinc-600 hover:underline">
          &larr; Back to record
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Edit customer</h1>
      <EditCustomerForm id={record.id} record={record} />
    </section>
  );
}
