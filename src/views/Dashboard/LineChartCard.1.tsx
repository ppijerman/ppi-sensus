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
  title: string;
  data: unknown[];
  dataKeys: string[];
  axisKey: string;
  strokes: string[];
}> = ({ title, data, dataKeys, axisKey, strokes }) => (
  <Card className="w-full ">
    <p className="mb-5">{title}</p>
    <div className="h-[400px] w-full ">
      <ResponsiveContainer>
        <LineChart data={data}>
          {dataKeys.map((k, i) => (
            <Line type="monotone" dataKey={k} key={k} stroke={strokes[i]} />
          ))}
          <XAxis dataKey={axisKey} />
          <YAxis />
          <Tooltip />
          <Legend align="center" verticalAlign="bottom" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
