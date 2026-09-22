import Link from "next/link";
import { listCustomers } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const records = await listCustomers();

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Customer records</h1>
      {records.length === 0 ? (
        <p className="mt-6 text-zinc-600">
          No customer records yet.{" "}
          <Link href="/customers/new" className="underline text-zinc-900">
            Create the first customer
          </Link>
          .
        </p>
      ) : (
        <table className="mt-6 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="px-3 py-2 text-zinc-600">Company</th>
              <th className="px-3 py-2 text-zinc-600">Contact</th>
              <th className="px-3 py-2 text-zinc-600">Buyer</th>
              <th className="px-3 py-2 text-zinc-600">BD email</th>
              <th className="px-3 py-2 text-zinc-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                <td className="px-3 py-2">
                  <Link href={`/customers/${r.id}`} className="font-medium text-zinc-900 hover:underline">
                    {r.company_name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-zinc-600">{r.company_contact ?? "—"}</td>
                <td className="px-3 py-2 text-zinc-600">{r.buyer_name ?? "—"}</td>
                <td className="px-3 py-2 text-zinc-600">{r.bd_email ?? "—"}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      r.status === "submitted"
                        ? "rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                        : "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                    }
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
