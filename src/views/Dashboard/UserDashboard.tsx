import { useContext, useMemo } from "react";
import { Card } from "../../Components";
import { trpc } from "../../utils/trpc";
import { BarChartCard } from "./BarChartCard";
import { FederalStateContext } from "./FederalStateContext";
import { GeoVis } from "./Geovis";
import { PPICabangGraph } from "./PPICabangGraph";
import { PieChartCard } from "./PieChartCard";
import { UserStatistics } from "./UserStatistics";

export const UserDashboard = () => {
  const federalState = useContext(FederalStateContext);
  const { data } = trpc.internal.getStatistics.useQuery({
    bundesland: federalState,
  });

  const { data: ppiCabangStats } = trpc.internal.getPPICabangStats.useQuery();

  const educationStats = [
    { name: "Ausbildung", value: data?.vocation },
    { name: "Bachelor (S1)", value: data?.bachelor },
    { name: "Master (S2)", value: data?.master },
    { name: "PhD (S3)", value: data?.doctorand },
    { name: "Profesor", value: data?.professor },
  ];

  const genderGraphStats = [
    { name: "Laki-laki", value: data?.male },
    { name: "Perempuan", value: data?.female },
  ];

  useMemo(() => {
    return ppiCabangStats?.sort((a, b) => b.count - a.count);
  }, [ppiCabangStats]);
  return (
    <div className="mt-4 flex w-full flex-col gap-5 2xl:flex-row">
      <div className="flex flex-row flex-wrap gap-5 2xl:basis-[55%]">
        <Card className="w-full">
          <UserStatistics stats={educationStats} />
        </Card>
        <PieChartCard graphStats={genderGraphStats} />
        <BarChartCard
          data={educationStats}
          dataKeyAxis={"name"}
          dataKey={"value"}
        />

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
  );
};
