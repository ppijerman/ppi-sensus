import { router } from "../trpc";
import { getAdminStatistics } from "./internal/getAdminStatistics";
import { getAdmins } from "./internal/getAdmins";
import { getPPICabangStats } from "./internal/getPPICabangStats";
import { getStatistics } from "./internal/getStatistics";
import { getStatisticsPerFederalState } from "./internal/getStatisticsPerFederalState";
import { getStudentOccupationStats } from "./internal/getStudentOccupationStats";

export const internalRouter = router({
  getStatistics,
  getAdmins,
  getPPICabangStats,
  getStudentOccupationStats,
  getAdminStatistics,
  getStatisticsPerFederalState,
});
