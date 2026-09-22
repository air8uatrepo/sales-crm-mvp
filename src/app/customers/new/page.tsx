"use client";

import { useRouter } from "next/navigation";

export default function NewCustomerForm() {
  const router = useRouter();

  async function onSubmit(e: { preventDefault: () => void; target: HTMLFormElement }) {
    e.preventDefault();
    const result = await onSubmitAction(e);
    if (result && result.redirect) {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900">New customer</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4" id="customer-form">
        <label className="block text-sm font-medium text-zinc-700" htmlFor="company_name">
          Company name
        </label>
        <input
          id="company_name"
          name="company_name"
          required
          className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <label className="block text-sm font-medium text-zinc-700" htmlFor="company_contact">
          Company contact
        </label>
        <input
          id="company_contact"
          name="company_contact"
          className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <label className="block text-sm font-medium text-zinc-700" htmlFor="buyer_name">
          Cooperating buyer
        </label>
        <input
          id="buyer_name"
          name="buyer_name"
          className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <label className="block text-sm font-medium text-zinc-700" htmlFor="bd_email">
          BD email
        </label>
        <input
          id="bd_email"
          name="bd_email"
          type="email"
          className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Save draft
        </button>
      </form>
    </section>
  );
}

async function onSubmitAction(e: { preventDefault: () => void; target: HTMLFormElement }) {
  const form = e.target;
  const data = new FormData(form);
  const payload = {
    company_name: String(data.get("company_name") ?? ""),
    company_contact: String(data.get("company_contact") ?? ""),
    buyer_name: String(data.get("buyer_name") ?? ""),
    bd_email: String(data.get("bd_email") ?? ""),
  };

  const res = await fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Failed to create customer record.";
    try {
      const body = await res.json();
      msg = "Failed to create: " + (body.error ?? "unknown error");
    } catch {
      // fallthrough
    }
    window.alert(msg);
    return null;
  }
  return { redirect: true };
}
