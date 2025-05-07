import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

// Define a single performance item
interface PerformanceGraphItem {
  month: number; // 1 = Jan, 2 = Feb, etc.
  Totalorderforthisclient: number;
  passorders: number;
  totalfailorders: number;
}

// Component props
interface OrdersBarChartProps {
  performaneGraphData: PerformanceGraphItem[];
}
const removeLegendValuePlugin = {
  id: 'removeLegendValue',
  beforeInit(chart) {
    const originalFit = chart.legend.fit;
    chart.legend.fit = function fit() {
      originalFit.bind(chart.legend)();
      this.height += 20; // Optional extra spacing
    };
  },
  beforeUpdate(chart) {
    const datasets = chart.data.datasets;

    chart.legend.legendItems = datasets.map((dataset, index) => ({
      text: dataset.label, // Only show label, no numbers
      fillStyle: dataset.backgroundColor,
      hidden: !chart.isDatasetVisible(index),
      datasetIndex: index,
      strokeStyle: dataset.borderColor,
      pointStyle: 'roundRect'
    }));
  }
};
const OrdersBarChart = ({ performaneGraphData }: OrdersBarChartProps) => {
  const monthLabels = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const labels = performaneGraphData.map((item) => monthLabels[item.month]);
  const totalOrders = performaneGraphData.map(
    (item) => item.Totalorderforthisclient
  );
  const passOrders = performaneGraphData.map((item) => item.passorders);
  const failOrders = performaneGraphData.map((item) => item.totalfailorders);

  const data = {
    labels,
    datasets: [
      {
        label: "Total orders",
        data: totalOrders,
        backgroundColor: "#007bff",
      },
      {
        label: "Pass orders",
        data: passOrders,
        backgroundColor: "#28a745",
      },
      {
        label: "Fail orders",
        data: failOrders,
        backgroundColor: "#dc3545",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        align: 'start', 
        
        labels: {
          usePointStyle: true,
          pointStyle: "roundRect", 
          boxWidth: 8,
          boxHeight: 8,
          padding: 30,
          
        },
        itemDistance: 400,
      },
      title: {
        display: true,
        text: "Marks",
      },
      datalabels: {
        display: false // <--- THIS disables value on bar (257 like number)
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return <Bar data={data} options={options}  plugins={[removeLegendValuePlugin]} />;
};

export default OrdersBarChart;
