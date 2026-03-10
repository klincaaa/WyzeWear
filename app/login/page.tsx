import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Prijava
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Ulogujte se u svoj nalog da biste pristupili porudžbinama i adresama.
          </p>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-zinc-600">
            Nemate nalog?{" "}
            <Link href="/register" className="font-medium text-zinc-900 underline">
              Registrujte se
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
