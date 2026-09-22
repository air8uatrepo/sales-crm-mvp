"use client";

import { useRouter } from "next/navigation";

export default function SubmitButton({ id }: { id: string }) {
  const router = useRouter();

  async function onSubmit() {
    const res = await fetch(`/api/customers/${id}/submit`, { method: "POST" });
    if (res.ok) {
      router.refresh();
    } else {
      let msg = "Failed to submit the record.";
      try {
        const body = await res.json();
        msg = "Failed to submit: " + (body.error ?? "unknown error");
      } catch {
        // fallthrough
      }
      window.alert(msg);
    }
  }

  return (
    <button
      type="button"
      onClick={onSubmit}
      className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white"
    >
      Submit
    </button>
  );
}
