import { LoginForm } from "@/components/login-form";
import { authConfigured } from "@/lib/auth/server";
export const dynamic = "force-dynamic";
export default function LoginPage() { return <LoginForm enabled={authConfigured()} />; }
