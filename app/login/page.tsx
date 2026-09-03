"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Login gagal.");
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#04080f] px-6 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-slate-800 bg-[#07121b] p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/70">ACID</p>
        <h1 className="mt-2 text-2xl font-semibold">Dashboard login</h1>
        <p className="mt-2 text-sm text-slate-400">Masukkan password admin untuk mengelola project.</p>
        <label className="mt-6 block text-sm text-slate-300">
          Password
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-700 bg-[#06141f] px-3 py-2 outline-none focus:border-cyan-400"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-md border border-cyan-400 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Checking..." : "Open dashboard"}
        </button>
      </form>
    </main>
  );
}
