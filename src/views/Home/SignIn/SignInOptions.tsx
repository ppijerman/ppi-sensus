// pages/signin.js

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card, Footer } from "../../../Components";
import GoogleButton from "./GoogleSignInButton";

export const SignInOptionsPage = () => {
  const back = useRouter().back;
  return (
    <>
      <Head>
        <title>ONE | Sign In</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-center py-12">
        <Card className="rounded-lg bg-gray-50 px-5 py-5 sm:mx-auto sm:w-full sm:max-w-md">
          <button
            onClick={() => back()} // Use router.back() to go to the previous page
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h2 className="mt-6 text-center text-3xl text-gray-900">
            Daftar di Sensus PPI Jerman
          </h2>
          <div className="mt-8">
            <div>
              <div>
                <Link href={"./emaillogin"}>
                  <button className="flex w-full cursor-pointer justify-center rounded-lg rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Sign in with Email
                  </button>
                </Link>
              </div>
              <div className="mt-4">
                <SignUpByEmail />
              </div>
              <div className="mt-4">
                <GoogleButton />
              </div>
            </div>
          </div>
          <Footer />
        </Card>
      </div>
    </>
  );
};

const SignUpByEmail: React.FC = () => (
  <Link href="./signup">
    <button className="flex w-full cursor-pointer justify-center rounded-lg rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      Sign Up By Email
    </button>
  </Link>
);
