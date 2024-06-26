import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  AcademicCapIcon,
  Bars3BottomLeftIcon,
  CheckCircleIcon,
  CheckIcon,
  // ChartBarIcon,
  CogIcon,
  FolderIcon,
  // HomeIcon,
  // InboxIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Footer, Logo, Protected } from ".";
import { VerifyWarning } from "./VerifyWarning";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Base component for the application. Contains sidebar.
 *
 * @component
 * @param {React.ReactNode} children - The content of the component.
 * @param {string} title - The title of the component.
 * @returns {React.ReactElement} The rendered Base component.
 */

export const Base: React.FC<{
  children?: React.ReactNode;
  title?: string;
}> = ({
  children = (
    <div className="py-4">
      <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
    </div>
  ),
  title = "Dashboard",
}) => {
  const router = useRouter();
  const [navigation] = useState([
    // {
    //   name: "Home",
    //   href: "/",
    //   icon: HomeIcon,
    // },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: FolderIcon,
    },
    {
      name: "Admins",
      href: "/admins",
      icon: AcademicCapIcon,
    },
    {
      name: "Users",
      href: "/users",
      icon: UsersIcon,
      roles: ["ADMIN"],
    },
    {
      name: "My Profile",
      href: "/profile",
      icon: UserCircleIcon,
      roles: ["ADMIN", "USER"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: CogIcon,
      roles: ["ADMIN", "USER"],
    },
    {
      name: "Verify",
      href: "/verify",
      icon: CheckCircleIcon,
      // delete admin later, so that verify only for users
    },
    // {
    //   name: "Reports",
    //   href: "#",
    //   icon: ChartBarIcon,
    // },
  ]);
  const [userNavigation] = useState([
    { name: "Your Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },
  ]);
  const { data: sessionData } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Protected redirectTo="/">
      <div className=" h-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-50 pb-4 pt-5">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <Logo />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation
                        .filter(
                          (item) =>
                            !item.roles ||
                            item.roles.includes(
                              sessionData?.user?.role || "ADMIN",
                            ),
                        )
                        .map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              router.pathname === item.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "group flex items-center rounded-md px-2 py-2 text-base font-medium",
                            )}
                          >
                            <item.icon
                              className={classNames(
                                router.pathname === item.href
                                  ? "text-gray-500"
                                  : "text-gray-400 group-hover:text-gray-500",
                                "mr-4 h-6 w-6 flex-shrink-0",
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="z-50 hidden bg-slate-50 transition-all duration-500 hover:w-64 md:fixed md:inset-y-0 md:flex md:w-[65px] md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-slate-50 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              {/* logo link to home page */}
              <Link href="/">
                <Logo />
              </Link>
            </div>
            <div className="mt-5 flex flex-grow flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {navigation
                  .filter(
                    (item) =>
                      !item.roles ||
                      item.roles.includes(sessionData?.user?.role || "ADMIN"),
                  )
                  .map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        router.pathname === item.href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium",
                      )}
                    >
                      <item.icon
                        className={classNames(
                          router.pathname === item.href
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500",
                          "ml-1 mr-5 h-6 w-6 flex-shrink-0",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-slate-50 md:pl-16 2xl:pl-64">
          <div className="mx-auto flex max-w-[95%] flex-col md:px-8 xl:px-0">
            <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-slate-50">
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex flex-1 justify-between px-4 md:px-0">
                <div className="flex flex-1 items-center">
                  <p className="text-md font-medium text-gray-500">
                    {sessionData?.user?.name
                      ? `${sessionData?.user?.name}`
                      : "Welcome"}{" "}
                    {sessionData?.user?.verification === "VERIFIED" ? (
                      <div className="flex flex-row gap-1">
                        <CheckIcon className="h-6 w-6 text-sky-500" />
                        <p className="text-sky-500">Verified</p>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-1">
                        <p className="text-red-500">Unverified</p>
                      </div>
                    )}
                  </p>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        {sessionData?.user?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            className="h-8 w-8 rounded-full"
                            src={sessionData?.user?.image}
                            alt=""
                          />
                        ) : (
                          <UserCircleIcon className="h-8 w-8 rounded-full" />
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-50 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700",
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block cursor-pointer px-4 py-2 text-sm text-gray-700",
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
            <Protected verification="UNVERIFIED">
              <VerifyWarning href="/verify" />
            </Protected>
            <main className="flex-1 bg-slate-50">
              <div className="py-6">
                <div className="px-4 sm:px-6 md:px-0">
                  <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                </div>
                <div className="min-h-screen px-4 sm:px-6 md:px-0">
                  {children}
                </div>
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </div>
    </Protected>
  );
};
