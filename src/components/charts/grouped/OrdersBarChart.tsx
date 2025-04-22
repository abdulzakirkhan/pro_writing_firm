import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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

const OrdersBarChart = ({ performaneGraphData }: OrdersBarChartProps) => {
  const monthLabels = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const labels = performaneGraphData.map((item) => monthLabels[item.month]);
  const totalOrders = performaneGraphData.map(item => item.Totalorderforthisclient);
  const passOrders = performaneGraphData.map(item => item.passorders);
  const failOrders = performaneGraphData.map(item => item.totalfailorders);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total orders',
        data: totalOrders,
        backgroundColor: '#007bff'
      },
      {
        label: 'Pass orders',
        data: passOrders,
        backgroundColor: '#28a745'
      },
      {
        label: 'Fail orders',
        data: failOrders,
        backgroundColor: '#dc3545'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Marks'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default OrdersBarChart;
