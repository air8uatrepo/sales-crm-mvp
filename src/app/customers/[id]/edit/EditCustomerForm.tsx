"use client";

import { useRouter } from "next/navigation";

type CustomerRecordForForm = {
  id: string;
  company_name: string;
  company_contact: string | null;
  buyer_name: string | null;
  bd_email: string | null;
};

export default function EditCustomerForm({ id, record }: { id: string; record: CustomerRecordForForm }) {
  const router = useRouter();

  async function onSubmit(e: { preventDefault: () => void; target: HTMLFormElement }) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const payload = {
      company_name: String(data.get("company_name") ?? ""),
      company_contact: String(data.get("company_contact") ?? ""),
      buyer_name: String(data.get("buyer_name") ?? ""),
      bd_email: String(data.get("bd_email") ?? ""),
    };

    const res = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push(`/customers/${id}`);
      router.refresh();
    } else {
      let msg = "Failed to update the record.";
      try {
        const body = await res.json();
        msg = "Failed to update: " + (body.error ?? "unknown error");
      } catch {
        // fallthrough
      }
      window.alert(msg);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 bg-white">
      <label className="block text-sm font-medium text-zinc-700" htmlFor="company_name">
        Company name
      </label>
      <input
        id="company_name"
        name="company_name"
        defaultValue={record.company_name}
        required
        className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm"
      />
      <label className="block text-sm font-medium text-zinc-700" htmlFor="company_contact">
        Company contact
      </label>
      <input
        id="company_contact"
        name="company_contact"
        defaultValue={record.company_contact ?? ""}
        className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm"
      />
      <label className="block text-sm font-medium text-zinc-700" htmlFor="buyer_name">
        Cooperating buyer
      </label>
      <input
        id="buyer_name"
        name="buyer_name"
        defaultValue={record.buyer_name ?? ""}
        className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm"
      />
      <label className="block text-sm font-medium text-zinc-700" htmlFor="bd_email">
        BD email
      </label>
      <input
        id="bd_email"
        name="bd_email"
        type="email"
        defaultValue={record.bd_email ?? ""}
        className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Save changes
      </button>
    </form>
  );
}
