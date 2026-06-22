import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, ADMIN_HINT } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, Crown } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin-login")({
  component: AdminLogin,
  head: () => ({
    meta: [
      { title: "Admin Login — Jalvindar Computer" },
      { name: "description", content: "Restricted area — administrators only." },
    ],
  }),
});

function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success("Welcome, Administrator");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 sm:py-16">
      <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Jalvindar Computer logo"
            className="h-16 w-auto max-w-[200px] object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mt-3">Admin Sign In</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Restricted area — administrators only.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Admin email" icon={<Mail className="h-4 w-4" />}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className={inputCls}
            />
          </Field>
          <Field label="Password" icon={<Lock className="h-4 w-4" />}>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background rounded-full px-6 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Enter Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-border rounded-md pl-9 pr-3 py-2.5 text-sm bg-background outline-none focus:border-primary";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
    </label>
  );
}
