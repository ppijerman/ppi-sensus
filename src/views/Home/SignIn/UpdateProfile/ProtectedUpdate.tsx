import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const ProtectedUpdate: React.FC<{
  children?:
    | React.ReactNode
    | ((callback: { session: Session }) => React.ReactNode);
  redirectTo?: string;
  replacer?: JSX.Element;
}> = (props) => {
  const { data: session, status } = useSession();
  const { replace, push } = useRouter();

  if (status === "loading") {
    return props.replacer ?? null;
  }

  const unauthenticated = () => {
    props.redirectTo && replace(props.redirectTo || "/");
    return props.replacer ?? null;
  };

  if (status === "unauthenticated") {
    return unauthenticated();
  }

  if (!session || !session.user) {
    return unauthenticated();
  }

  if (session.user.updated) {
    // If user has updated their profile, redirect to dashboard
    push("/dashboard");
    return;
  }

  return (
    <>
      {props?.children
        ? typeof props.children === "function"
          ? props.children({ session })
          : props.children
        : null}
    </>
  );
};
