import type { FC } from "react";
import { useContext } from "react";
import { Card } from "../../Components";
import { trpc } from "../../utils/trpc";
import { FederalStateContext } from "./FederalStateContext";
import { PieChartCard } from "./PieChartCard";
import { UserStatistics } from "./UserStatistics";

export const AdminStatistics: FC = () => {
  const federalState = useContext(FederalStateContext);
  const { data: adminData } = trpc.internal.getAdminStatistics.useQuery({
    bundesland: federalState,
  });
  const verifyStatistics = [
    { name: "Total Pengguna", value: adminData?.users },
    { name: "Pengguna Terverifikasi", value: adminData?.verified },
    { name: "Belum Terverifikasi", value: adminData?.unverified },
    { name: "Info belum lengkap", value: adminData?.updated },
  ];

  const verifiedGraph = [
    { name: "Verified", value: adminData?.verified },
    { name: "Non-Verified", value: adminData?.unverified },
    { name: "Incomplete", value: adminData?.updated },
  ];

  const rolesGraph = [
    { name: "Admins", value: adminData?.admins },
    {
      name: "Users",
      value: (adminData?.users ?? 0) - (adminData?.admins ?? 0),
    },
  ];

  const activeGraph = [
    { name: "Active", value: adminData?.active },
    {
      name: "Inactive",
      value: adminData?.inactive,
    },
  ];

  return (
    <>
      <Card className="basis-full">
        <UserStatistics stats={verifyStatistics} />
      </Card>
      <PieChartCard graphStats={verifiedGraph} />
      <PieChartCard graphStats={rolesGraph} />
      <PieChartCard graphStats={activeGraph} />
    </>
  );
};
