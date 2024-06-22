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
  desc?: string;
  data: unknown[];
  dataKey?: string;
  dataKeyAxis: string;
}> = ({ title = "Mahasiswa", data, dataKey = "count", dataKeyAxis, desc }) => (
  <Card className=" w-full ">
    <div className="flex flex-1 flex-col">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">{desc}</p>
      </div>
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
    </div>
  </Card>
);
