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
    <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="flex flex-col items-center justify-center rounded-lg bg-white/20 p-4 text-center"
        >
          <div className="text-xl font-bold">{stat.name}</div>
          <div className="text-4xl font-bold">
            <CountUp end={stat.value ?? 0} duration={2} />
          </div>
        </div>
      ))}
    </div>
  );
};
