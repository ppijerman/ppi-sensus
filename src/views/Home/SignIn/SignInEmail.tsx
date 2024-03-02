import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

export const SignInEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    signIn("credentials", { email, password, redirect: false }).then((a) => {
      if (a && a.error) {
        setError(a.error);
      } else {
        router.push("./dashboard");
      }
    });
  };

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center">
      <h2 className="mb-2 text-xl font-bold">Sign In</h2>
      {error && (
        <div className="mb-10 flex items-center  justify-center font-bold text-red-500">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-red flex flex-col items-center justify-center gap-4 lg:min-w-[25%]"
      >
        <label htmlFor="email" className=" self-start">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          autoComplete="email"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <label htmlFor="password" className=" self-start">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <button
          type="submit"
          className="self-stretch rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
          onClick={handleSubmit}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};
