import {
  differenceInYears,
  eachMonthOfInterval,
  eachYearOfInterval,
  format,
  sub,
} from "date-fns";
import type { FC } from "react";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../../Components";

import { useGetAdminStats } from "./useGetAdminStats";

export const LineChartCard: FC = () => {
  const { adminData } = useGetAdminStats();
  const createdAt = adminData?.dates.map((x) => x.createdAt) ?? [];
  const updatedAt = adminData?.dates.map((x) => x.updatedAt) ?? [];
  const birthdays =
    adminData?.dates.filter((x) => x.birthDate).map((x) => x.birthDate) ?? [];

  const [months, createdAtCount] = showStatisticsInMonths(
    9,
    Map.groupBy(createdAt, (d) => format(d, monthDateFormat)),
  );
  const [, updatedAtCount] = showStatisticsInMonths(
    9,
    Map.groupBy(updatedAt, (d) => format(d, monthDateFormat)),
  );
  const [years, birthDateCounts] = showStatisticsInYears(
    50,
    Map.groupBy(birthdays, (d) => format(d as Date, yearDateFormat)),
  );

  const usersBehavior = months.map((month, i) => ({
    month,
    createdAt: createdAtCount[i],
    updatedAt: updatedAtCount[i],
  }));

  const userYearsOfBirth = years
    .map((year, i) => ({
      age: differenceInYears(new Date(), new Date(year)),
      count: birthDateCounts[i],
    }))
    .reverse();
  return (
    
      <Card className="w-full">
        <div className="w-full h-[400px]">
        <ResponsiveContainer>
          <LineChart data={usersBehavior}>
            <Line type="monotone" dataKey="createdAt" stroke="#82b89d" />
            <Line type="monotone" dataKey="updatedAt" stroke="#8884d8" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend align="center" verticalAlign="bottom" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card className="h-[400px] w-full ">
        <ResponsiveContainer>
          <BarChart data={userYearsOfBirth} width={600} height={200}>
            <Bar type="monotone" dataKey="count" fill="#8884d8" />
            <XAxis dataKey="age" />
            <YAxis />
            <Legend align="center" verticalAlign="bottom" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </Card>
      
    
  );
};
export const monthDateFormat = "MMMM y";
export const yearDateFormat = "y";
export const showStatisticsInMonths = (
  months: number,
  map: Map<string, unknown[]>,
) => {
  const dates = eachMonthOfInterval({
    start: sub(new Date(), { months }),
    end: new Date(),
  }).map((d) => format(d, monthDateFormat));

  return [dates, dates.map((d) => map.get(d)?.length ?? 0)] as const;
};

export const showStatisticsInYears = (
  years: number,
  map: Map<string, unknown[]>,
) => {
  const dates = eachYearOfInterval({
    start: sub(new Date(), { years }),
    end: new Date(),
  }).map((d) => format(d, yearDateFormat));

  return [dates, dates.map((d) => map.get(d)?.length ?? 0)] as const;
};
