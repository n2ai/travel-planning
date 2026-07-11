"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";
import Link from "next/link";

export default function EnterCodePage() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [codeError, setCodeError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function codeChanged(
    position: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    // Only allow one number
    const newDigit = event.target.value
      .replace(/[^0-9]/g, "")
      .slice(-1);

    const newCode = [...code];
    newCode[position] = newDigit;

    setCode(newCode);
    setCodeError("");

    // Move to the next box automatically
    if (newDigit !== "" && position < 3) {
      inputRefs.current[position + 1]?.focus();
    }
  }

  function keyPressed(
    position: number,
    event: KeyboardEvent<HTMLInputElement>
  ) {
    // Move back when Backspace is pressed on an empty box
    if (
      event.key === "Backspace" &&
      code[position] === "" &&
      position > 0
    ) {
      inputRefs.current[position - 1]?.focus();
    }
  }

  function confirmCodeClicked() {
    const completeCode = code.join("");

    if (completeCode.length !== 4) {
      setCodeError("Please enter the complete 4-digit code");
      return;
    }

    // Frontend demo only
    alert("Code confirmed: " + completeCode);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4eddf] px-4 py-8">
      <div className="relative flex min-h-[560px] w-full max-w-[520px] items-center justify-center rounded-3xl bg-white p-8 text-gray-900 shadow-xl">
        {/* Back button */}
        <Link
          href="/forgot-password"
          aria-label="Go back"
          className="absolute left-8 top-8 flex h-10 w-10 items-center justify-center rounded-full text-4xl font-light text-black transition hover:bg-gray-100"
        >
          ‹
        </Link>

        <div className="flex w-full max-w-[340px] flex-col items-center">
          <h1 className="mb-3 text-center text-4xl font-bold tracking-tight text-black">
            Enter Code
          </h1>

          <p className="mb-10 text-center text-sm font-medium text-gray-700">
            Enter 4-digit code we sent via email.
          </p>

          {/* Four code boxes */}
          <div className="mb-3 flex w-full justify-center gap-4">
            {code.map((digit, position) => (
              <input
                key={position}
                ref={(element) => {
                  inputRefs.current[position] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => codeChanged(position, event)}
                onKeyDown={(event) => keyPressed(position, event)}
                className="h-14 w-14 border-0 border-b-2 border-gray-700 bg-transparent text-center text-2xl font-semibold text-black outline-none transition focus:border-[#2F80ED]"
                aria-label={`Code digit ${position + 1}`}
              />
            ))}
          </div>

          {/* Reserved space keeps the layout still */}
          <p className="mb-4 h-6 w-full text-center text-sm text-red-500">
            {codeError}
          </p>

          <button
            type="button"
            onClick={confirmCodeClicked}
            className="w-full rounded-lg bg-linear-to-r from-[#2F80ED] to-[#BB00FF] py-4 text-lg font-semibold text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
          >
            Confirm
          </button>
        </div>
      </div>
    </main>
  );
}