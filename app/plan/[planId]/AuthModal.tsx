"use client";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-[#BB00FF] to-[#2F80ED]" />
        <h3 className="text-lg font-black text-gray-900">Sign up to edit</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create a free account to customize and save this trip.
        </p>

        <a
          href="/signup"
          className="mt-5 block rounded-full bg-gradient-to-r from-[#BB00FF] to-[#2F80ED] py-3 text-sm font-black text-white"
        >
          Sign up
        </a>

        <a href="/login" className="mt-2 block text-sm font-semibold text-[#BB00FF]">
          Already have an account? Log in
        </a>

        <button
          onClick={onClose}
          className="mt-4 text-xs text-gray-400 hover:text-gray-600"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}