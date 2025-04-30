import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const BatchAverageOverview = ({pieChartData}) => {
  const data = {
    labels: pieChartData.map(item => item.value),
    datasets: [
      {
        data: pieChartData.map(item => item.value),
        backgroundColor: ['#13A09D', '#1E8AD3', '#F4A300'],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };
  const colorMap = ['bg-[#13A09D]', 'bg-[#1E8AD3]', 'bg-[#F4A300]','bg-[#13A09D]'];
  const textColorMap = ['text-[#13A09D]', 'text-[#1E8AD3]', 'text-[#F4A300]','text-[#13A09D]'];
  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      <h2 className="text-center font-semibold mb-4">Batch Average Overview</h2>

      <div className="relative h-[150px] w-[150px] mx-auto">
        <Pie data={data} options={options} />
      </div>

      <div className="mt-4 border rounded-md p-2 text-sm">
          {pieChartData.map((item,index) => (
            <div className="flex justify-between items-center mb-2" key={index}>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full  ${colorMap[index]} `}/>
                {/* <span>Batch 01</span> */}
              </div>
              <span className={`${textColorMap[index]} font-semibold`}>{item?.text}</span>
            </div>
          ))}
        {/* <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1E8AD3]" />
            <span>Batch 03</span>
          </div>
          <span className="text-[#1E8AD3] font-semibold">40%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F4A300]" />
            <span>Batch 02</span>
          </div>
          <span className="text-[#F4A300] font-semibold">10%</span>
        </div> */}
      </div>
    </div>
  );
};

export default BatchAverageOverview;
