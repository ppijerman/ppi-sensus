import type { FC } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../../Components";
export type PieChartCardType = {
  graphStats: { name: string; value?: number; fill?: string }[];
  title?: string;
  desc: string;
};
const DEFAULT_COLOR = ["#3399FF", "#CC0000", "#888888"];
export const PieChartCard: FC<PieChartCardType> = ({
  graphStats,
  title = "Mahasiswa",
  desc,
}) => (
  <Card className="2xl: flex flex-[100%] lg:flex-[48%] 2xl:flex-[32%]">
    <div className="flex flex-1 flex-col">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">{desc}</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={graphStats.map((x, i) => ({
                ...x,
                fill: x.fill ?? DEFAULT_COLOR[i % DEFAULT_COLOR.length],
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              label
            />
            <Tooltip />
            <Legend align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
