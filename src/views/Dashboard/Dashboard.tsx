import { type NextPage } from "next";
import Head from "next/head";
import { Base, Protected } from "../../Components";
import { AdminStatistics } from "./AdminStatistics";
import { UserDashboard } from "./UserDashboard";

export const Dashboard: NextPage = () => (
  <>
    <Head>
      <title>ONE | Dashboard</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Base title="Dashboard">
      <Protected verification="UNVERIFIED">
        {/* added a warning verification if user is unverified */}
      </Protected>
      <Protected redirectTo="/">
        <UserDashboard />
        <Protected roles={["ADMIN"]}>
          <AdminStatistics />
        </Protected>
      </Protected>
    </Base>
  </>
);
