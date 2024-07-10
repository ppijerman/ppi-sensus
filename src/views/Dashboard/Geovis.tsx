import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import { FederalStateContext } from "./FederalStateContext";
import styles from "./Geovis.module.css";
import { GermanyOutline } from "./GermanyOutline";
import { GermanySVGPath } from "./GermanyPath";

const RANGE = 150;
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
      Math.floor(255 - (x[1] / maxStudentsPerState) * RANGE).toString(16),
    ]),
  );

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
      <div className="mt-20 grid w-full grid-cols-8">
        <>
          {Array(8)
            .fill(undefined)
            .map((_, i) => (
              <div
                className="flex h-5 w-full items-center justify-center text-center"
                style={{
                  backgroundColor: `#33${Math.floor(255 - (i / 8) * RANGE).toString(16)}55`,
                }}
              />
            ))}
        </>
        <div className="col-span-8 flex items-center justify-between">
          <span>0</span>
          <span>{maxStudentsPerState}</span>
        </div>
      </div>
    </div>
  );
};
