import { PieChartCard } from "./PieChartCard";
import { useGetAdminStats } from "./useGetAdminStats";

export const AdminPieCharts = () => {
  const { adminData } = useGetAdminStats();

  const verifiedGraph = [
    { name: "Terverifikasi", value: adminData?.verified },
    { name: "Belum terverifikasi", value: adminData?.unverified },
    { name: "Data tidak lengkap", value: adminData?.updated },
  ];

  const subscribedGraph = [
    { name: "Pelanggan", value: adminData?.subscribed },
    { name: "Bukan Pelanggan", value: adminData?.unsubscribed },
  ];

  const rolesGraph = [
    { name: "Admin", value: adminData?.admins },
    {
      name: "Pengguna",
      value: (adminData?.users ?? 0) - (adminData?.admins ?? 0),
    },
  ];

  const activeGraph = [
    { name: "Aktif", value: adminData?.active },
    {
      name: "Tidak aktif",
      value: adminData?.inactive,
    },
  ];

  const thirdPartyGraph = [
    { name: "Boleh", value: adminData?.thirdPartyConsent },
    {
      name: "Tidak boleh",
      value: adminData?.noThirdPartyConsent,
    },
  ];
  return (
    <>
      <PieChartCard
        graphStats={verifiedGraph}
        desc={"Menurut status verifikasinya"}
      />
      <PieChartCard graphStats={rolesGraph} desc={"Menurut perannya"} />
      <PieChartCard graphStats={activeGraph} desc={"Menurut keaktifannya"} />
      <PieChartCard
        graphStats={subscribedGraph}
        desc={"Menurut penyetelan pelangganan"}
      />
      <PieChartCard
        graphStats={thirdPartyGraph}
        desc={"Menurut izin pemberian datanya kepada pihak ketiga"}
      />
    </>
  );
};
