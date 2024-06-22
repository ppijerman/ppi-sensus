import type { FC } from "react";
import { Card } from "../../Components";
import { AdminPieCharts } from "./AdminPieCharts";
import { FullCharts } from "./FullCharts";
import { UserStatistics } from "./UserStatistics";
import { useGetAdminStats } from "./useGetAdminStats";

export const AdminStatistics: FC = () => {
  const { adminData } = useGetAdminStats();
  const verifyStatistics = [
    { name: "Total Pengguna", value: adminData?.users },
    { name: "Pengguna Terverifikasi", value: adminData?.verified },
    { name: "Belum Terverifikasi", value: adminData?.unverified },
    { name: "Info belum lengkap", value: adminData?.updated },
  ];

  return (
    <>
      <hr className="my-10 w-full " />
      <h1 className="text-3xl font-bold text-gray-900">
        Statistik untuk Admin
      </h1>
      <div className="mt-4 flex w-full flex-col gap-10 2xl:flex-row">
        <div className="flex flex-wrap justify-between gap-x-5 gap-y-5">
          <Card className="basis-full">
            <UserStatistics stats={verifyStatistics} />
          </Card>
          <AdminPieCharts />
          <FullCharts />
        </div>
      </div>
    </>
  );
};
