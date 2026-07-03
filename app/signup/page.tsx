"use client";

import { useState } from "react";
import Link from "next/link";

type UserAccount = {
  username: string;
  email: string;
  password: string;
};

function getUsers(): UserAccount[] {
  const savedUsers = localStorage.getItem("users");

  if (savedUsers === null) {
    return [];
  }

  return JSON.parse(savedUsers) as UserAccount[];
}

function saveUsers(users: UserAccount[]) {
  localStorage.setItem("users", JSON.stringify(users));
}

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const passwordHasCapitalLetter = /[A-Z]/.test(password);
  const passwordHasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  function createAccountClicked() {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (username === "") {
      setUsernameError("Username is required");
      hasError = true;
    }

    if (email === "") {
      setEmailError("Email is required");
      hasError = true;
    }

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email !== "" && emailFormat.test(email) === false) {
      setEmailError("Please enter a valid email");
      hasError = true;
    }

    if (password === "") {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (
      password !== "" &&
      passwordHasCapitalLetter === false &&
      passwordHasSpecialCharacter === false
    ) {
      setPasswordError(
        "Password needs 1 capital letter and 1 special character"
      );
      hasError = true;
    } else if (password !== "" && passwordHasCapitalLetter === false) {
      setPasswordError("Password needs 1 capital letter");
      hasError = true;
    } else if (password !== "" && passwordHasSpecialCharacter === false) {
      setPasswordError("Password needs 1 special character");
      hasError = true;
    }

    if (confirmPassword === "") {
      setConfirmPasswordError("Confirm password is required");
      hasError = true;
    }

    if (
      password !== "" &&
      confirmPassword !== "" &&
      password !== confirmPassword
    ) {
      setConfirmPasswordError("Password not match");
      hasError = true;
    }

    const users = getUsers();

    const usernameExists = users.find((user) => user.username === username);
    const emailExists = users.find((user) => user.email === email);

    if (username !== "" && usernameExists !== undefined) {
      setUsernameError("Username already exists");
      hasError = true;
    }

    if (email !== "" && emailExists !== undefined) {
      setEmailError("Email already exists");
      hasError = true;
    }

    if (hasError === true) {
      return;
    }

    const newUser = {
      username: username,
      email: email,
      password: password,
    };

    saveUsers([...users, newUser]);

    alert("Account created for " + username);

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="min-h-screen bg-[#f4eddf] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[560px] min-h-[850px] bg-white rounded-3xl shadow-xl flex items-center justify-center p-8 text-gray-900">
        <div className="w-full max-w-[380px] flex flex-col items-center">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-lg border border-black bg-white px-4 py-4 text-base text-gray-900 placeholder:text-gray-500 outline-none"
          />

          <p className="h-6 w-full text-left text-sm text-red-500">
            {usernameError}
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-black bg-white px-4 py-4 text-base text-gray-900 placeholder:text-gray-500 outline-none"
          />

          <p className="h-6 w-full text-left text-sm text-red-500">
            {emailError}
          </p>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-black bg-white px-4 py-4 text-base text-gray-900 placeholder:text-gray-500 outline-none"
          />

          <div className="mt-2 mb-2 w-full rounded-lg bg-gray-100 p-3 text-sm">
            <p className="mb-1 font-medium text-gray-700">
              Password must contain:
            </p>

            <p
              className={
                passwordHasCapitalLetter ? "text-green-600" : "text-gray-500"
              }
            >
              ✓ 1 capital letter
            </p>

            <p
              className={
                passwordHasSpecialCharacter
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              ✓ 1 special character "Exmaple: * @ # $ "
            </p>
          </div>

          <p className="h-6 w-full text-left text-sm text-red-500">
            {passwordError}
          </p>

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-black bg-white px-4 py-4 text-base text-gray-900 placeholder:text-gray-500 outline-none"
          />

          <p className="h-6 w-full text-left text-sm text-red-500">
            {confirmPasswordError}
          </p>

          <button
            onClick={createAccountClicked}
              className="mt-3 mb-5 w-full rounded-lg bg-linear-to-r from-[#2F80ED] to-[#BB00FF] py-4 text-lg font-semibold text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"

          >
            Create Account
          </button>

          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}