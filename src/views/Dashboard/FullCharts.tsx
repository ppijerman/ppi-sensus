import { differenceInYears, format } from "date-fns";
import type { FC } from "react";

import { BarChartCard } from "./BarChartCard";
import { LineChartCard } from "./LineChartCard.1";
import {
  monthDateFormat,
  showStatisticsInMonths,
} from "./showStatisticsInMonths";
import { showStatisticsInYears, yearDateFormat } from "./showStatisticsInYears";
import { useGetAdminStats } from "./useGetAdminStats";

export const FullCharts: FC = () => {
  const { adminData } = useGetAdminStats();
  const createdAt = adminData?.dates.map((x) => x.createdAt) ?? [];
  const updatedAt = adminData?.dates.map((x) => x.updatedAt) ?? [];
  const birthdays =
    adminData?.dates.filter((x) => x.birthDate).map((x) => x.birthDate) ?? [];
  const expectedGraduation =
    adminData?.dates
      .filter((x) => x.expectedGraduation)
      .map((x) => x.expectedGraduation) ?? [];

  const [months, createdAtCount] = showStatisticsInMonths(
    9,
    Map.groupBy(createdAt, (d) => format(d, monthDateFormat)),
  );
  const [, updatedAtCount] = showStatisticsInMonths(
    9,
    Map.groupBy(updatedAt, (d) => format(d, monthDateFormat)),
  );
  const [birthYears, birthDateCounts] = showStatisticsInYears(
    50,
    Map.groupBy(birthdays, (d) => format(d as Date, yearDateFormat)),
  );
  const [monthsForward, expectedGraduationCount] = showStatisticsInMonths(
    -24,
    Map.groupBy(expectedGraduation, (d) => format(d as Date, monthDateFormat)),
  );

  const usersBehavior = months.map((month, i) => ({
    month,
    createdAt: createdAtCount[i],
    updatedAt: updatedAtCount[i],
  }));

  const userYearOfBirth = birthYears
    .map((year, i) => ({
      age: differenceInYears(new Date(), new Date(year)),
      count: birthDateCounts[i],
    }))
    .reverse()
    .slice(10);

  const expectedGraduationYear = monthsForward
    .map((month, i) => ({
      month,
      count: expectedGraduationCount[i],
    }))
    .reverse();

  return (
    <>
      <LineChartCard
        title="User Creation and Update"
        data={usersBehavior}
        dataKeys={["createdAt", "updatedAt"]}
        axisKey={"month"}
        strokes={["#82b89d", "#8884d8"]}
      />

      <BarChartCard
        title="Age Distribution"
        data={userYearOfBirth}
        dataKeyAxis={"age"}
      />
      <BarChartCard
        title="Graduation Date Distribution"
        data={expectedGraduationYear}
        dataKeyAxis={"month"}
      />
    </>
  );
};
