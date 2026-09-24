// RadarChart.tsx

import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  Tooltip,
  Legend,
  CategoryScale,
  Title,
  Filler,
} from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(
  RadialLinearScale,
  Tooltip,
  Legend,
  CategoryScale,
  Title,
  Filler,
);

interface RadarChartProps {
  data: number[];
  labels: string[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data, labels }) => {
  // Data for the radar chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "User Playstyle (accuracy)",
        data: data,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Options for customizing the radar chart appearance
  const chartOptions = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        angleLines: {
          display: true,
        },
        grid: {
          circular: true,
        },
      },
    },
  };

  return <Radar data={chartData} options={chartOptions} />;
};

export default RadarChart;
