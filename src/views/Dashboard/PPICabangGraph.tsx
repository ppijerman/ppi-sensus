import { useState } from "react";
import { Button } from "evergreen-ui";

// recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stat {
  ppiCabangStats:
    | {
        label: string;
        value: string;
        count: number;
      }[]
    | undefined;
}

export const PPICabangGraph: React.FC<Stat> = ({ ppiCabangStats }: Stat) => {
  const modifiedPpiCabangStats = ppiCabangStats?.map((stat) => ({
    label: stat.label.slice(4),
    value: stat.value,
    count: stat.count,
  }));

  const [showAll, setShowAll] = useState(false);
  const displayedStats = showAll
    ? modifiedPpiCabangStats
    : modifiedPpiCabangStats?.slice(0, 5);

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">PPI Cabang</h1>
        <p className="text-gray-500">Distribusi PPI Cabang di Jerman</p>
      </div>
      <div style={{ width: "100%", height: 500 }}>
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={displayedStats}
            barGap={0}
            barCategoryGap={0}
            margin={{ top: 0, right: -20, left: 80, bottom: 0 }}
          >
            <YAxis
              type="category"
              dataKey="label"
              padding={{
                top: 0,
                bottom: 0,
              }}
              minTickGap={5}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, dx: -5 }}
              interval={0}
            />
            <XAxis type="number" axisLine={false} tickLine={false} tick={false} />
            <Tooltip />
            <Bar
              dataKey="count"
              barSize={30}
              fill="#8CB9BD"
              name="Jumlah Anggota"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center">
        <Button appearance="default" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "Show More"}
        </Button>
      </div>
    </div>
  );
};
