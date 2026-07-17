import Link from "next/link";
import PlanTripForm from "../components/PlanTripForm";

export default function PlanTripPage() {
  return (
    <main className="min-h-screen bg-[#f4eddf] text-[#07182f]">
      {/* NAVBAR */}
      <header className="bg-linear-to-br from-[#fbe9ff] via-[#f4eddf] to-[#f4eddf] px-6 pt-8 sm:px-10 lg:px-16 xl:px-24">
        <nav className="relative z-50 flex w-full items-center justify-between">
          <div className="flex items-center gap-8 text-base font-extrabold sm:gap-10 sm:text-lg">
            <Link href="/" className="transition hover:text-[#7c3aed]">
              Home
            </Link>

            <a href="#hotels" className="transition hover:text-[#7c3aed]">
              Hotels
            </a>

            <a href="#deals" className="transition hover:text-[#7c3aed]">
              Deals
            </a>

            <a href="#features" className="transition hover:text-[#7c3aed]">
              Guides
            </a>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/login"
              className="text-base font-extrabold text-[#07182f] transition hover:text-[#7c3aed] sm:text-lg"
            >
              Sign In
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              className="text-2xl font-black text-[#4f46e5] transition hover:scale-110"
            >
              ≡
            </button>
          </div>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <section className="min-h-[calc(100vh-80px)] bg-linear-to-br from-[#fbe9ff] via-[#f4eddf] to-[#f4eddf] px-6 pt-20">
        <h1 className="text-center text-4xl font-black tracking-tight text-[#07182f]">
          Plan a new trip
        </h1>

        <PlanTripForm />
      </section>
    </main>
  );
}