import { PieChartCard } from "./PieChartCard";
import { useGetAdminStats } from "./useGetAdminStats";

export const AdminPieCharts = () => {
  const { adminData } = useGetAdminStats();

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
      <PieChartCard graphStats={verifiedGraph} />
      <PieChartCard graphStats={rolesGraph} />
      <PieChartCard graphStats={activeGraph} />
    </>
  );
};
