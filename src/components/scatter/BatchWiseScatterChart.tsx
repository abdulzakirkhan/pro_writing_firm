import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const BatchWiseScatterChart = () => {
  const data = {
    datasets: [
      {
        label: 'Batch A',
        data: [
          { x: 1, y: 60 },
          { x: 2, y: 70 },
          { x: 3, y: 65 },
          { x: 4, y: 50 },
          { x: 5, y: 80 },
          { x: 6, y: 60 },
          { x: 7, y: 70 }
        ],
        backgroundColor: '#00A7C5'
      },
      {
        label: 'Batch B',
        data: [
          { x: 1, y: 45 },
          { x: 2, y: 60 },
          { x: 3, y: 55 },
          { x: 4, y: 70 },
          { x: 5, y: 60 },
          { x: 6, y: 50 },
          { x: 7, y: 75 }
        ],
        backgroundColor: '#F4A300'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend:false as const,
      title: false,
      datalabels: {
        display: false // <-- This makes sure nothing is rendered on points
      }
    },
    scales: {
      x: {
        position: 'top', 
        title: {
          display: true,
          text: 'Marks',
          align: 'start',
        },
        min: 0,
        max: 8,
        ticks: {
          stepSize: 1
        }
      },
      y: {
        title: {
          display: false,
          text: 'Marks'
        },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="h-[300px] w-full">
      <Scatter data={data} options={options} />
    </div>
  );
};

export default BatchWiseScatterChart;
