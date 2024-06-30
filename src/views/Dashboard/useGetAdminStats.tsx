import { useContext } from "react";
import { trpc } from "../../utils/trpc";
import { FederalStateContext } from "./FederalStateContext";

export const useGetAdminStats = () => {
  const federalState = useContext(FederalStateContext);
  const { data: adminData } = trpc.internal.getAdminStatistics.useQuery({
    bundesland: federalState,
  });
  return { adminData };
};
