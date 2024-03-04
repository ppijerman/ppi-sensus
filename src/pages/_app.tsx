import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { trpc } from "../utils/trpc";
import Script from "next/script";
import { Background } from "../Components/Background";

import "../styles/globals.css";
import { toaster } from "evergreen-ui";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onError = (error: any) => {
  toaster.danger(`(${error.name || "Error"}): ${error.data.code}`, {
    description: error.data.code === error?.message ? null : error?.message,
  });
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Script
        defer
        data-domain="ppi.one"
        src="https://plausible.dlx.pw/js/plausible.js"
      />
      <ReactQueryDevtools initialIsOpen={false} />
      <Background />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
