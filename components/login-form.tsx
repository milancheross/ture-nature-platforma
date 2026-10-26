"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { signIn, signUp } from "@/lib/auth/client";
import { useI18n } from "@/lib/i18n";

export function LoginForm({ enabled }: { enabled: boolean }) {
  const { language } = useI18n(); const en = language === "en";
  const [register, setRegister] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return <main className="page-width auth-layout"><div className="auth-photo"><img src="/images/tara-hike.jpg" alt={en ? "A trail in Serbia" : "Staza u Srbiji"} /><p>{en ? <>Good things<br />happen outside.</> : <>Dobre stvari<br />čekaju napolju.</>}</p></div><div className="auth-form"><p className="eyebrow">{en ? "WELCOME TO STAZA" : "DOBRO DOŠLI NA STAZU"}</p><h1>{register ? en ? "Start your story." : "Započni svoju priču." : en ? "Good to see you." : "Lepo je videti te."}</h1><p>{enabled ? en ? "Save your plans, contact local guides and share your own adventures." : "Sačuvaj planove, poveži se sa vodičima i podeli svoje avanture." : en ? "Registration and sign-in are currently unavailable. You can still explore the sample catalog." : "Registracija i prijava trenutno nisu dostupne. Možeš da istražiš katalog primera."}</p>{enabled ? <><form onSubmit={async (e) => {
    e.preventDefault(); setPending(true); setError(""); const data = new FormData(e.currentTarget);
    try {
      const input = { email: String(data.get("email")).trim().toLowerCase(), password: String(data.get("password")), name: String(data.get("name") || "") };
      const response = register ? await signUp.email(input) : await signIn.email(input);
      if (response.error) throw new Error();
      router.push("/host"); router.refresh();
    } catch { setError(en ? "We couldn’t sign you in. Check your details and try again." : "Prijava nije uspela. Proveri podatke i pokušaj ponovo."); }
    finally { setPending(false); }
  }}>{register && <label className="form-field">{en ? "Your name" : "Tvoje ime"}<input name="name" autoComplete="name" required minLength={2} maxLength={120} /></label>}<label className="form-field">Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label><label className="form-field">{en ? "Password" : "Lozinka"}<input name="password" type="password" autoComplete={register ? "new-password" : "current-password"} minLength={10} maxLength={128} required /></label>{register && <p className="text-xs text-muted">{en ? "Use at least 10 characters." : "Koristi najmanje 10 znakova."}</p>}{error && <p role="alert" className="form-error">{error}</p>}<button className="btn btn-dark" type="submit" disabled={pending}>{pending ? en ? "One moment…" : "Trenutak…" : register ? en ? "Create account" : "Napravi nalog" : en ? "Sign in" : "Prijavi se"}<ArrowUpRight size={17} /></button></form><button className="auth-switch" onClick={() => { setRegister(!register); setError(""); }}>{register ? en ? "Already have an account? Sign in" : "Već imaš nalog? Prijavi se" : en ? "New here? Create an account" : "Prvi put si ovde? Napravi nalog"}</button></> : <Link href="/explore" className="btn btn-dark mt-7">{en ? "Explore tours" : "Istraži ture"}<ArrowUpRight size={17} /></Link>}</div></main>;
}
