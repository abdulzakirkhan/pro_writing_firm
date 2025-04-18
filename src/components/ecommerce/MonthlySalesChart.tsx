import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 180,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    markers: {
      size: 6,
      colors: ["#465fff"],
      strokeColors: "#fff",
      strokeWidth: 2,
      shape: "circle",
      hover: {
        size: 8,
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#465fff"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "March", "April", "May", "June","July"
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}`,
        style: {
          colors: '#64748b',
          fontSize: '12px',
        }
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `$${val}`,
        title: { formatter: () => "Sales" },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 5,
    },
  };

  const series = [
    {
      name: "Sales",
      data: [1, 50, 201, 100, 150, 500, 1000],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Cost Comparison
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-full">
          <Chart 
            options={options} 
            series={series} 
            type="area" 
            height={180}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}