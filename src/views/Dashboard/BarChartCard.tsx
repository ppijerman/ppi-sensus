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
  title?: string;
  data: unknown[];
  dataKey?: string;
  dataKeyAxis: string;
}> = ({ title, data, dataKey = "count", dataKeyAxis }) => (
  <Card className=" w-full ">
    {title && <p className="mb-5">{title}</p>}
    <div className="h-[250px]">
      <ResponsiveContainer>
        <BarChart data={data} width={600} height={200}>
          <Bar type="monotone" dataKey={dataKey} fill="#8884d8" />
          <XAxis dataKey={dataKeyAxis} />
          <YAxis />
          <Legend align="center" verticalAlign="bottom" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);