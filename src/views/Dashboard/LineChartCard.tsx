import type { FC } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../../Components";

export const LineChartCard: FC<{
  title?: string;
  data: unknown[];
  dataKeys: string[];
  axisKey: string;
  desc: string;
  strokes: string[];
  lineNames: string[];
}> = ({
  title = "Mahasiswa",
  data,
  dataKeys,
  axisKey,
  strokes,
  desc,
  lineNames,
}) => (
  <Card className="w-full ">
    <div className="flex flex-1 flex-col">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">{desc}</p>
      </div>
      <div className="h-[300px] w-full ">
        <ResponsiveContainer>
          <LineChart data={data}>
            {dataKeys.map((k, i) => (
              <Line
                type="monotone"
                dataKey={k}
                key={k}
                stroke={strokes[i]}
                name={lineNames[i]}
              />
            ))}
            <XAxis dataKey={axisKey} />
            <YAxis />
            <Tooltip />
            <Legend align="center" verticalAlign="bottom" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
