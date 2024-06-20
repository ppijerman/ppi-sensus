import type { FC } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../../Components";
export type PieChartCardType = {
  graphStats: { name: string; value?: number; fill?: string }[];
};
const DEFAULT_COLOR = "#0EA5E9";
export const PieChartCard: FC<PieChartCardType> = ({ graphStats }) => (
  <Card className="flex h-[350px] flex-[100%] lg:flex-[48%] 2xl:flex-[32%]">
    <div className="w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={graphStats.map((x) => ({
              ...x,
              fill: x.fill ?? DEFAULT_COLOR,
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
  </Card>
);
