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
  const [showAll, setShowAll] = useState(false);
  const displayedStats = showAll ? ppiCabangStats : ppiCabangStats?.slice(0, 5);

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">PPI Cabang</h1>
        <p className="text-gray-500">Distribusi PPI Cabang di Jerman</p>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={displayedStats}
            barGap={0}
            barCategoryGap={0}
            margin={{ top: 0, right: 0, left: -35, bottom: 0 }}
          >
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" barSize={30} fill="#8CB9BD" />
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
