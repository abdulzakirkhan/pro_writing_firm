import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const BarChartOne = ({title ="",labels, dataSet}) => {
  const data: ChartData<'bar'> = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: dataSet,
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex;
          return index === 6 ? '#13A09D' : '#006B9F'; // July is teal, others are blue
        },
        borderRadius: 5,
        barThickness: 25,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#333',
        font: {
          weight: 'bold',
          size: 12,
        },
        formatter: (value: number) => value,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => `${ctx.raw} orders ${title}`,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#999',
          font: {
            size: 11
          }
        },
        grid: {
          color: '#e5e5e5'
        }
      },
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="w-full h-[330px] p-4">
      <h2 className="text-md font-semibold mb-4">{title}</h2>
      <Bar data={data} options={options} className='p-6 lg:p-0' />
    </div>
  );
};

export default BarChartOne;
