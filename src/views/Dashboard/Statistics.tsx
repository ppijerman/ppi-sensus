import CountUp from "react-countup";
import { Card } from "@/Components";

type StatisticOutput = {
  stats: {
    name: string;
    count: number | undefined;
  }[];
};

export const UserStatistics: React.FC<StatisticOutput> = ({
  stats,
}: StatisticOutput) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="font-bold text-2xl">Statistik</h1>
        <p className="text-gray-500">Gambaran umum data sensus</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-2 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold">
                <CountUp end={stat.count ?? 0} duration={2} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.name}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
