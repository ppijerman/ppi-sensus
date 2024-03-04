/* This example requires Tailwind CSS v3.0+ */
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Footer, Logo, Protected } from "../../Components";
import { Background } from "../../Components/Background";

const navigation = [
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
  { name: "FAQ", href: "#" },
];

export const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: sessionData } = useSession();
  const { push } = useRouter();

  return (
    <>
      <Head>
        <title>ONE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="isolate bg-white">
        <Background />
        <div className="px-6 pt-6 lg:px-8">
          <div>
            <nav
              className="flex h-9 items-center justify-between"
              aria-label="Global"
            >
              <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">ONE</span>
                  <Logo />
                </Link>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:gap-x-12">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="font-semibold text-gray-900 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
                <a
                  onClick={() =>
                    sessionData
                      ? signOut({ callbackUrl: `${window.location.origin}/` })
                      : push("/signin")
                  }
                  className="inline-block cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                  {sessionData ? "Sign out" : "Sign in"}
                </a>
              </div>
            </nav>
            <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
              <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
                <div className="flex h-9 items-center justify-between">
                  <div className="flex">
                    <Link href="/" className="-m-1.5 p-1.5">
                      <span className="sr-only">ONE</span>
                      <Logo />
                    </Link>
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="py-6">
                      <a
                        onClick={() =>
                          sessionData ? signOut() : push("/signin")
                        }
                        className="-mx-3 block cursor-pointer rounded-lg px-3 py-2.5 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                      >
                        {sessionData ? "Sign out" : "Sign in"}
                      </a>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </div>
        </div>
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pb-32 pt-20 sm:pb-40 sm:pt-48">
              <div>
                {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                    <span className="text-gray-600">
                      Announcing our latest features.{" "}
                      <a href="#" className="font-semibold text-pink-600">
                        <span className="absolute inset-0" aria-hidden="true" />
                        Read more <span aria-hidden="true">&rarr;</span>
                      </a>
                    </span>
                  </div>
                </div> */}
                <Protected>
                  {({ session }) => (
                    <div className="mb-4 flex justify-center">
                      <div className="relative overflow-hidden rounded-full px-4 py-1.5 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                        <span className="text-gray-600">
                          Signed in as{" "}
                          <Link
                            href="/profile"
                            className="font-semibold text-pink-600"
                          >
                            {session?.user?.email}
                          </Link>
                        </span>
                      </div>
                    </div>
                  )}
                </Protected>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    Connecting people, reimagined.
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                    Experience how ONE can help you connect with others.
                  </p>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    <a
                      onClick={() =>
                        sessionData ? push("/dashboard") : push("/signin")
                      }
                      className="inline-block cursor-pointer rounded-lg bg-pink-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-pink-600 hover:bg-pink-700 hover:ring-pink-700"
                    >
                      Get started{" "}
                      <span className="text-pink-200" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                    <a
                      href="#"
                      className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                    >
                      Learn more{" "}
                      <span className="text-gray-400" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
                <Footer />
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                  <svg
                    className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
                    viewBox="0 0 1155 678"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                      fillOpacity=".3"
                      d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                    />
                    <defs>
                      <linearGradient
                        id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                        x1="1155.49"
                        x2="-78.208"
                        y1=".177"
                        y2="474.645"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#9089FC" />
                        <stop offset={1} stopColor="#FF80B5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
