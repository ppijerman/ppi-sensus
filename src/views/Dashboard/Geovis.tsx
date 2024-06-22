import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";
import { trpc } from "../../utils/trpc";
import { FederalStateContext } from "./FederalStateContext";
import { GermanyOutline } from "./GermanyOutline";
import { GermanySVGPath } from "./GermanyPath";

const xLabels = ["Ausbildung", "Bachelor", "Master", "Doctor", "Professor"];

interface TooltipState {
  data: { name: string | undefined; value: number | undefined }[];
}

export const GeoVis: React.FC<{ width: string }> = ({ width }) => {
  const [tooltip, setTooltip] = useState<TooltipState>({ data: [] });
  const [hoveredBundesland, setHoveredBundesland] = useState("");
  const bundesland = useContext(FederalStateContext);
  const router = useRouter();

  const { data: occupationStats, isSuccess } =
    trpc.internal.getStudentOccupationStats.useQuery(
      { bundesland: hoveredBundesland },
      { enabled: !!hoveredBundesland },
    );

  useEffect(() => {
    if (hoveredBundesland && isSuccess && occupationStats) {
      const tooltipContent = xLabels.map((label, index) => ({
        name: label,
        value: occupationStats[index],
      }));
      setTooltip({ data: tooltipContent });
    }
  }, [hoveredBundesland, isSuccess, occupationStats]);

  const handleMouseOver = (bundesland: string) => {
    setHoveredBundesland(bundesland);
  };

  return (
    <div
      className="flex w-full flex-col items-center"
      onMouseLeave={() => setHoveredBundesland("")}
    >
      <div className="max-w-[400px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width={width}
          viewBox="0 0 591.504 800.504"
          className="flex-none"
        >
          <g>
            {GermanySVGPath.map((path, id) => (
              <>
                <g>
                  <path
                    key={id}
                    id={path.id}
                    d={path.d}
                    className={`duration-3000 cursor-pointer ${bundesland === path.id ? "fill-green-400" : "fill-blue-400"} stroke-white stroke-[1px] transition hover:fill-red-200`}
                    onMouseOver={() => handleMouseOver(path.id)}
                    onClick={() =>
                      bundesland === path.id
                        ? router.push("/dashboard")
                        : router.push(`/dashboard/${path.id}`)
                    }
                  />

                  <text
                    cx="50%" // Center horizontally
                    cy="50%" // Center vertically
                    textAnchor="middle" // Center the text
                    dominantBaseline="middle" // Center the text
                    fontSize="16" // Adjust font size as needed
                    fill="white" // Text color
                  >
                    Your centered text
                  </text>
                </g>
              </>
            ))}
          </g>
          <path id="path3789" d={GermanyOutline.d} className="fill-none" />
        </svg>
      </div>

      <div className="flex flex-col justify-center py-5">
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
      </div>
    </div>
  );
};
