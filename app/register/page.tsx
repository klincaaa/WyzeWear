import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Registracija
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Napravite nalog da biste brže završavali kupovinu i pratili porudžbine.
          </p>
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-zinc-600">
            Već imate nalog?{" "}
            <Link href="/login" className="font-medium text-zinc-900 underline">
              Prijavite se
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
