import type { FC } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../../Components";

export const BarChartCard: FC<{
  data: unknown[];
  dataKey?: string;
  dataKeyAxis: string;
}> = ({ data, dataKey = "count", dataKeyAxis }) => (
  <Card className="h-[400px] w-full ">
    <ResponsiveContainer>
      <BarChart data={data} width={600} height={200}>
        <Bar type="monotone" dataKey={dataKey} fill="#8884d8" />
        <XAxis dataKey={dataKeyAxis} />
        <YAxis />
        <Legend align="center" verticalAlign="bottom" />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);
