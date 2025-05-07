import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { FaSyncAlt, FaChartBar } from 'react-icons/fa';
import { HiMiniChartBarSquare } from "react-icons/hi2";
import Loader from '../Loader/Loader';
ChartJS.register(ArcElement, Tooltip, Legend);
interface CreditUsageChartProps {
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
}
const CreditUsageChart : React.FC<CreditUsageChartProps>  = ({creditLimit,usedCredit,availableCredit}) => {
 
    const used = usedCredit;
    const limit = creditLimit;
    const remaining = availableCredit;
  
    const data = {
      datasets: [
        {
          data: [used, remaining],
          backgroundColor: (context: { chart: any; }) => {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
  
            if (!chartArea) return ['#254E5C', '#E5E5E5']; // fallback
  
            const gradient = ctx.createLinearGradient(
              chartArea.left,
              chartArea.top,
              chartArea.right,
              chartArea.bottom
            );
  
            gradient.addColorStop(0.28, '#254E5C');
            gradient.addColorStop(0.7, '#13A09D');
  
            return [gradient,"#E5E5E5"]; // used, remaining
          },
          borderWidth: 0,
          cutout: '80%'
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
          enabled: false
        },
        datalabels: {
          display: false // 👈 THIS IS THE FIX - HIDE POINT VALUE
        }
      }
    };

  
    return (
      <div className="bg-white rounded-lg shadow p-4 w-full">
        <p className="text-center text-sm mb-2">
          You have <span className="text-teal-600 font-semibold">${limit}</span> credit limit
        </p>
  
        <div className="relative h-[150px] w-[150px] mx-auto">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-[#137DA0]">${used}</p>
            <p className="text-md font-bold text-black">${limit}</p>
          </div>
        </div>
  
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between items-center py-2 px-2 rounded-lg" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
            <div className="flex items-center gap-2">
              <FaSyncAlt size={30} className="text-[#137DA0]" />
              <span>Credit Used:</span>
            </div>
            <span className="font-semibold">${used}</span>
          </div>

          <div className="flex justify-between items-center py-2 px-2 rounded-lg" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
            <div className="flex items-center gap-2">
              <HiMiniChartBarSquare size={35} className="text-[#137DA0]" />
              <span>Credit Remaining:</span>
            </div>
            <span className="font-semibold">${remaining}</span>
          </div>
        </div>
      </div>
    );
  };
  

export default CreditUsageChart;
