"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      if (mode === "login") {
        const res = await signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message);
      } else {
        const res = await signUp.email({ email, password, name });
        if (res.error) throw new Error(res.error.message);
      }
      toast.success(mode === "login" ? "Prijavljen si" : "Nalog je kreiran");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Greška pri prijavi");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold">{mode === "login" ? "Prijava" : "Registracija"}</h1>
      <p className="mt-1 text-sm text-muted">
        {mode === "login"
          ? "Prijavi se da objavljuješ ture i upravljaš ponudama."
          : "Kreiraj nalog vodiča."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "register" ? (
          <div>
            <Label htmlFor="name">Ime</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        ) : null}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Lozinka</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "…" : mode === "login" ? "Prijavi se" : "Registruj se"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm text-muted underline-offset-4 hover:underline"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Nemaš nalog? Registruj se" : "Već imaš nalog? Prijavi se"}
      </button>
    </main>
  );
}
