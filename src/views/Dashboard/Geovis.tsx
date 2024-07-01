import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import { FederalStateContext } from "./FederalStateContext";
import styles from "./Geovis.module.css";
import { GermanyOutline } from "./GermanyOutline";
import { GermanySVGPath } from "./GermanyPath";
export const GeoVis: FC<{ width: string }> = ({ width }) => {
  const bundesland = useContext(FederalStateContext);
  const router = useRouter();
  const { data } = trpc.internal.getStatisticsPerFederalState.useQuery();

  const studentsPerStateCount =
    data?.totalStudentsPerState.map(
      (x) => [x.bundesland ?? "", x._count.id] as const,
    ) ?? [];
  const maxStudentsPerState =
    studentsPerStateCount.length > 1
      ? Math.max(...studentsPerStateCount.map((x) => x[1]))
      : Infinity;
  const stateColorMap = new Map(
    studentsPerStateCount?.map((x) => [
      x[0],
      Math.floor(255 - (x[1] / maxStudentsPerState) * 150).toString(16),
    ]),
  );
  console.log([...stateColorMap.keys()]);
  return (
    <div
      className={`flex h-full w-full max-w-[400px] flex-col items-center ${!!bundesland ? "justify-center" : "mt-10"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={width}
        viewBox="0 0 591.504 800.504"
        className="flex-none"
      >
        <g>
          {GermanySVGPath.map((path, id) => (
            <path
              key={id}
              id={path.id}
              d={path.d}
              className={`duration-3000 cursor-pointer stroke-white stroke-[1px] transition  ${styles.pathHover} fill-sky-400`}
              style={
                bundesland !== path.id
                  ? {
                      fill: `#33${stateColorMap.get(path.id) ?? "ff"}55`,
                    }
                  : undefined
              }
              onClick={() =>
                bundesland === path.id
                  ? router.push("/dashboard")
                  : router.push(`/dashboard/${path.id}`)
              }
            />
          ))}
        </g>
        <path
          id="path3789"
          d={GermanyOutline.d}
          className=" fill-none stroke-slate-400"
        />
      </svg>

      {/* <div className="flex flex-col justify-center py-5">
        <AnimatePresence>
          {hoveredBundesland && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none mt-5 flex flex-col items-center justify-center rounded-md bg-white shadow-md"
            >
              <h1 className="text-xl font-semibold">{hoveredBundesland}</h1>
              <BarChart
                data={tooltip.data}
                width={525}
                height={300}
                margin={{ left: 20, right: 20, top: 5, bottom: 5 }}
                barGap={2}
                barCategoryGap={1}
                barSize={40}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                <Bar dataKey="value" fill="#8CB9BD" legendType="none" />
              </BarChart>
            </motion.div>
          )}
        </AnimatePresence>
      </div> */}
    </div>
  );
};
