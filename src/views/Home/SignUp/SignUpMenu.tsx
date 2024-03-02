import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { trpc } from "../../../utils/trpc";

export const SignUpMenu: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const mutation = trpc.auth.register.useMutation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
    signIn("credentials", { email, password });
  };

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center">
      <h2 className="mb-2 text-xl font-bold">Sign Up</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-red flex flex-col items-center justify-center gap-4 lg:min-w-[25%]"
      >
        {mutation.isError && (
          <div className="p-20 ring-indigo-600">
            <p className="text-md text-red-500">{mutation.error.message}</p>
          </div>
        )}
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

        <label htmlFor="password" className=" self-start">
          Repeat Password:
        </label>
        <input
          type="password"
          id="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <button
          type="submit"
          className="self-stretch rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
          onClick={handleSubmit}
          disabled={mutation.isLoading}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
