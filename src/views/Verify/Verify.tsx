import Head from "next/head";
import { Base, Protected, Card } from "../../Components";
import { VerifyFormUni } from "./VerifyFormUni";
import { useSession } from "next-auth/react";
import { OccupationBadges } from "../../Components/OccupationBadges";
export const VerifyPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>ONE | Verify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Base title="Verification Page">
        <Protected redirectTo="/">
          <div className="my-3 flex flex-row items-center justify-start gap-3">
            <h1 className="text-xl font-semibold">Status:</h1>
            <OccupationBadges occupation={session?.user?.occupation || ""} />
          </div>
          <div className="flex flex-col gap-2 py-4">
            <Card>
              <VerifyFormUni />
            </Card>
          </div>
        </Protected>
      </Base>
    </>
  );
};
