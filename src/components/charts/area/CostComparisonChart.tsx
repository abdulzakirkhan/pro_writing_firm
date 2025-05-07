import { useRef } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
  Title
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register necessary components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
  Title
);

interface GraphDataPoint {
  month: any;
  TotalMonthlyCost: number;
}

interface Props {
  graphData: GraphDataPoint[];
}

function formatNumber(value: number) {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(1).replace(/\.0$/, '') + 'C';
  } else if (value >= 100000) {
    return (value / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return value;
  }
}
export default function CostComparisonChart({ graphData }: Props) {

  const monthLabels = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const chartRef = useRef(null);
  // console.log("graphData", graphData);

  // Extract labels and data from props
  const labels = graphData.map((entry) => monthLabels[entry.month]);
  const costData = graphData.map((entry) => Number(entry.TotalMonthlyCost));

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Cost Comparison',
        data: costData,
        fill: true,
        borderColor: '#00A7C5',
        backgroundColor: (context: { chart: any }) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0, 167, 197, 0.4)');
          gradient.addColorStop(1, 'rgba(0, 167, 197, 0.05)');
          return gradient;
        },
        pointBackgroundColor: '#00A7C5',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Cost Comparison',
        font: {
          size: 18
        }
      },
      datalabels: {
        display: false // 👈 THIS IS THE FIX - HIDE POINT VALUE
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number) {
            return formatNumber(value);
          }
        }
      }
    }
  };

  return (
    <Line
      ref={chartRef}
      data={data}
      options={options}
      className="w-full"
    />
  );
}
