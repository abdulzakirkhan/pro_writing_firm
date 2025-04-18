import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import React from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Dataset = {
  label: string;
  data: number[];
  backgroundColor: string;
};

type OrderChartProps = {
  title?: string;
  labels: string[];
  datasets: Dataset[];
  stacked?: boolean;
  maxY?: number;
};

const OrderSubjectChart: React.FC<OrderChartProps> = ({
  title = "Orders",
  labels,
  datasets,
  stacked = true,
  maxY = 100,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "start" as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 6, 
          font: { size: 12 },
          marginBottom:8
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        stacked: stacked,
        grid: { display: false },
        ticks: {
          font: { size: 12 },
          color: "#4B5563",
        },
      },
      y: {
        stacked: stacked,
        beginAtZero: true,
        max: maxY,
        ticks: {
          stepSize: 20,
          color: "#999",
          font: { size: 12 },
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  };

  return (
    <div className="w-full h-[310px]">
      <h2 className="text-md font-semibold mb-4">{title}</h2>
      <Bar
        data={{
          labels,
          datasets,
        }}
        options={options}
      />
    </div>
  );
};

export default OrderSubjectChart;
