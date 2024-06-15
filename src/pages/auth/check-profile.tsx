import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Logo } from "../../Components";
import { PuffLoader } from "react-spinners";

export const CheckProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [calledPush, setCalledPush] = useState(false); // State to track if redirect has been called

  useEffect(() => {
    // Check if redirection has already been initiated or if we're still loading the session
    if (calledPush || status === "loading") return;
    console.log("Checking profile", session, status);

    if (status === "unauthenticated") {
      // Redirect to sign-in if unauthenticated
      signIn("google");
      setCalledPush(true); // Prevent further actions
      return;
    }
    // Proceed with redirection based on the user's profile update status
    if (session?.user?.updated) {
      // If the user has updated their profile, redirect to the dashboard
      console.log("redirecting to dashboard");
      router.replace("/dashboard").then(() => setCalledPush(true));
    } else {
      // If the user has not updated their profile, redirect to the update page
      console.log("redirecting to update");
      router.replace("/update").then(() => setCalledPush(true));
    }
  }, [session, status, router, calledPush]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Logo />
      <PuffLoader />
      <h1 className="text-3xl font-bold">Verifying Account ... This may take a while</h1>
    </div>
  );
};

export default CheckProfile;
