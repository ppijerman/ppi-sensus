import { eachMonthOfInterval, format, sub } from "date-fns";

export const showStatisticsInMonths = (
  months: number,
  map: Map<string, unknown[]>,
) => {
  const dates = eachMonthOfInterval({
    start: sub(new Date(), { months }),
    end: new Date(),
  }).map((d) => format(d, monthDateFormat));

  return [dates, dates.map((d) => map.get(d)?.length ?? 0)] as const;
};
export const monthDateFormat = "MMMM y";
