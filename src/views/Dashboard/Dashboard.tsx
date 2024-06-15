import { type NextPage } from "next";
import Head from "next/head";
import { useContext, useMemo } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Base, Card, Protected } from "../../Components";
import { trpc } from "../../utils/trpc";
import { FederalStateContext } from "./FederalStateContext";
import { GeoVis } from "./Geovis";
import { PPICabangGraph } from "./PPICabangGraph";
import { UserStatistics } from "./Statistics";
import { StatsMahasiswa } from "./StatsMahasiswa";

export const Dashboard: NextPage = () => {
  const federalState = useContext(FederalStateContext);
  const { data } = trpc.internal.getStatistics.useQuery({
    bundesland: federalState,
  });
  const { data: adminData } = trpc.internal.getAdminStatistics.useQuery({
    bundesland: federalState,
  });
  const { data: ppiCabangStats } = trpc.internal.getPPICabangStats.useQuery();

  const statsAdmin = [
    { name: "Total Pengguna", count: adminData?.users },
    { name: "Pengguna Terverifikasi", count: adminData?.verified },
    { name: "Belum Terverifikasi", count: adminData?.unverified },
    { name: "Info belum lengkap", count: adminData?.updated },
  ];

  const statsDemografi = [
    { name: "Jumlah Mahasiswa", count: adminData?.users },
    { name: "Mahasiswa Terverifikasi", count: adminData?.verified },
  ];
  const statsMahasiswa = [
    { name: "Ausbildung", count: data?.vocation },
    { name: "Bachelor", count: data?.bachelor },
    { name: "Master", count: data?.master },
    { name: "PhD", count: data?.doctorand },
    { name: "Profesor", count: data?.professor },
  ];

  const graphStats = [
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
            <div className="flex flex-wrap justify-between gap-y-5 2xl:basis-2/3">
              <Protected roles={["ADMIN"]}>
                <Card className=" basis-full">
                  <UserStatistics stats={statsAdmin} />
                </Card>
              </Protected>

              <Card className="basis-full">
                <UserStatistics stats={statsDemografi} />
              </Card>
              <Card className="basis-full md:basis-[300px]">
                <StatsMahasiswa stats={statsMahasiswa} />
              </Card>
              {!federalState && (
                <Card className="basis-full md:basis-[calc(100%-320px)]">
                  <PPICabangGraph ppiCabangStats={ppiCabangStats} />
                </Card>
              )}
              <Card className="flex basis-full md:basis-[300px]">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={graphStats}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        label
                      />
                      <Tooltip />
                      <Legend align="center" verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <Card className="flex flex-col items-center 2xl:basis-1/3">
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
