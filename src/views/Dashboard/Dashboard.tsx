import { type NextPage } from "next";
import Head from "next/head";
import { useContext, useMemo } from "react";
import { Base, Card, Protected } from "../../Components";
import { trpc } from "../../utils/trpc";
import { AdminStatistics } from "./AdminStatistics";
import { FederalStateContext } from "./FederalStateContext";
import { GeoVis } from "./Geovis";
import { PPICabangGraph } from "./PPICabangGraph";
import { PieChartCard } from "./PieChartCard";
import { UserStatistics } from "./UserStatistics";

export const Dashboard: NextPage = () => {
  const federalState = useContext(FederalStateContext);
  const { data } = trpc.internal.getStatistics.useQuery({
    bundesland: federalState,
  });

  const { data: ppiCabangStats } = trpc.internal.getPPICabangStats.useQuery();

  const educationStats = [
    { name: "Ausbildung / Vokasi", value: data?.vocation },
    { name: "Bachelor / S1", value: data?.bachelor },
    { name: "Master / S2", value: data?.master },
    { name: "PhD / S3", value: data?.doctorand },
    { name: "Profesor", value: data?.professor },
  ];

  const genderGraphStats = [
    { name: "Laki-laki", value: data?.male, fill: "#0336FF" },
    { name: "Perempuan", value: data?.female, fill: "#FF0266" },
  ];

  useMemo(() => {
    return ppiCabangStats?.sort((a, b) => b.count - a.count);
  }, [ppiCabangStats]);

  //TODO: Add more visualizations for the dashboard.

  return (
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
          <div className="mt-4 flex w-full flex-col gap-10 2xl:flex-row">
            <div className="flex flex-wrap justify-between gap-x-5 gap-y-5 2xl:basis-[55%]">
              <Protected roles={["ADMIN"]}>
                <AdminStatistics />
              </Protected>
              <PieChartCard graphStats={genderGraphStats} />
              <Card className="flex-1 md:basis-[calc(100%-320px)]">
                <UserStatistics stats={educationStats} />
              </Card>
              {!federalState && (
                <Card className="basis-full">
                  <PPICabangGraph ppiCabangStats={ppiCabangStats} />
                </Card>
              )}
            </div>
            <Card className="flex flex-col items-center 2xl:basis-[45%]">
              <h1 className="mb-5 text-2xl font-semibold">
                {federalState ?? "Demografi Mahasiswa Indonesia di Jerman"}
              </h1>
              <GeoVis width="100%" />
            </Card>
          </div>
        </Protected>
      </Base>
    </>
  );
};
