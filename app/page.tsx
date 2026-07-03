import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4eddf] flex items-center justify-center">
      <Link
        href="/login"
        className="rounded-lg bg-blue-500 px-6 py-3 text-white"
      >
        Go to Login
      </Link>
    </main>
  );
}