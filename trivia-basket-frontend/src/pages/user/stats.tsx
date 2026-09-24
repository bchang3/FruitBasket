import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  Tooltip,
  PointElement,
  LineElement,
  Legend,
  CategoryScale,
  Title,
  Filler,
} from "chart.js";
import RadarChart from "@/lib/components/RadarChart";
import {
  getBestCategory,
  getWorstCategory,
  UserCategoryStat,
} from "@/utils/utils";

// Register the necessary Chart.js components
ChartJS.register(
  RadialLinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  Title,
  Filler,
);

interface RadarChartProps {
  data: number[];
  labels: string[];
}

export default function Stats() {
  const [username, setUsername] = useState<string>();
  const [elo, setElo] = useState<number>();
  const [categoryStats, setCategoryStats] = useState<UserCategoryStat[]>();
  const getUserStats = async (username: string) => {
    const res = await fetch(`/api/getUserStats/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const flash: UserCategoryStat[] = await res.json();
      setCategoryStats(
        flash.toSorted((a, b) => a.categoryName.localeCompare(b.categoryName)),
      );
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        console.log(data.elo);
        setElo(data.elo);
        getUserStats(data.username);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="flex flex-col items-center gap-12 text-center w-full h-full text-6xl text-primary-green font-semibold">
      {categoryStats && (
        <div className="flex flex-row h-full w-full">
          <div className="flex flex-col h-full w-1/2 text-3xl gap-16 items-start border-r-2 border-black">
            <div className="text-primary-green text-6xl mt-16">
              User statistics
            </div>
            <div className="flex flex-row gap-16">
              <span>Elo: </span>{" "}
              <span className="text-primary-chestnut">{elo}</span>
            </div>
            <div className="flex flex-row gap-16">
              <span>Best Category: </span>
              <span className="text-primary-chestnut">
                {getBestCategory(categoryStats)}
              </span>
            </div>
            <div className="flex flex-row gap-16">
              <span>Worst Category: </span>
              <span className="text-primary-chestnut">
                {getWorstCategory(categoryStats)}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center w-1/2 ml-48 items-center gap-12">
            <div className="text-primary-green text-6xl mt-24">Radar Chart</div>
            <RadarChart
              labels={categoryStats.map((cat) => cat.categoryName)}
              data={categoryStats.map((cat) => cat.accuracy * 100)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
