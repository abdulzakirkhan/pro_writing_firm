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

const OrdersBarChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Total orders',
        data: [20, 40, 60, 90, 15, 50, 60],
        backgroundColor: '#007bff'
      },
      {
        label: 'Pass orders',
        data: [15, 40, 45, 80, 15, 30, 60],
        backgroundColor: '#28a745'
      },
      {
        label: 'Fail orders',
        data: [5, 0, 15, 5, 0, 10, 0],
        backgroundColor: '#dc3545'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'  as const
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
