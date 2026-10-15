export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <h1 className="text-2xl font-bold">Prijava</h1>
      <p className="mt-2 text-center text-sm text-muted">
        Better Auth je povezan na <code>/api/auth/*</code>. Email/lozinka je omogućen.
      </p>
      <div className="mt-8 w-full rounded-xl border border-border bg-surface p-6 text-center text-sm">
        Implementiraj formu koja zove <code>authClient.signIn.email</code> i <code>authClient.signUp.email</code>.
      </div>
    </main>
  );
}
