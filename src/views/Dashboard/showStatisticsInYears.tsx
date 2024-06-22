import { eachYearOfInterval, format, sub } from "date-fns";

export const showStatisticsInYears = (
  years: number,
  map: Map<string, unknown[]>,
) => {
  const dates = eachYearOfInterval({
    start: sub(new Date(), { years }),
    end: new Date(),
  }).map((d) => format(d, yearDateFormat));

  return [dates, dates.map((d) => map.get(d)?.length ?? 0)] as const;
};
export const yearDateFormat = "y";
