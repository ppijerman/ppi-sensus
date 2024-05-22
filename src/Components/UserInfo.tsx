import { capitalize } from "../utils/capitalize";
import type { RouterOutputs } from "../utils/trpc";
import { CustomBadge } from "./CustomBadge";

type UserInfoProps = {
  user: RouterOutputs["user"]["getUser"];
};

export const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const userInfo = [
    { label: "E-mail", value: user.email },
    { label: "Jenis Kelamin", value: capitalize(user.gender ?? "Unspecified") },
    {
      label: "Verified",
      value: user.verification === "VERIFIED" ? "Yes" : "No",
    },
    {
      label: "Tanggal Lahir",
      value: user.birthDate?.toLocaleDateString() ?? "N/A",
    },
    { label: "Status Pendidikan", value: capitalize(user.occupation ?? "N/A") },
    {
      label: "Bidang Studi",
      value: capitalize(user.fieldOfStudy ?? "N/A"),
    },
    {
      label: "Spesialisasi Studi",
      value: user.studySpecialization ?? "N/A",
    },
    {
      label: "Perkiraan Lulus",
      value: user.expectedGraduation?.toLocaleDateString() ?? "N/A",
    },
    { label: "Afiliasi", value: user.affiliation.join(", ") ?? "N/A" },
    { label: "Jalan, Nomor Rumah", value: capitalize(user.address ?? "N/A") },
    { label: "Kode Pos", value: user.zipCode ?? "N/A" },
    { label: "Kota", value: capitalize(user.location ?? "N/A") },
    { label: "Negara Bagian", value: capitalize(user.bundesland ?? "N/A") },
    { label: "PPI Cabang", value: user.ppicabang ?? "N/A" },
  ];
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <h2 className="mb-4 text-2xl font-semibold">{user.name}</h2>
        <div>
          {user.role === "ADMIN" ? (
            <CustomBadge color="neutral" className="text-white">Admin</CustomBadge>
          ) : (
            <CustomBadge color="blue">User</CustomBadge>
          )}
        </div>
        {userInfo.map(({ label, value }) => (
          <div key={label}>
            <span className="font-bold">{label}: </span>
            {value}
          </div>
        ))}
      </div>
    </>
  );
};
