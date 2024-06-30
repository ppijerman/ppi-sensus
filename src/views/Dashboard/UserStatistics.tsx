import { Card } from "@/Components";
import CountUp from "react-countup";

type UserStatisticType = {
  stats: {
    name: string;
    value: number | undefined;
  }[];
};

export const UserStatistics: React.FC<UserStatisticType> = ({
  stats,
}: UserStatisticType) => {
  return (
    <div className="flex flex-col">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Statistik</h1>
        <p className="text-gray-500">Gambaran umum data sensus</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-2 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold">
                <CountUp end={stat.value ?? 0} duration={2} />
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
