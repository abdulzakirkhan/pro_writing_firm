import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { MdOutlineTrendingUp } from "react-icons/md";
import { AiFillDollarCircle } from "react-icons/ai";
import users from "../../assets/Icons.png"


interface EcommerceMetricsProps {
  total: number;
  totalClient: number;
  costIncreasePercentage: any;
  clientsIncreasePercentage: any;
}
export default function EcommerceMetrics({total,totalClient,costIncreasePercentage,clientsIncreasePercentage}:EcommerceMetricsProps) {
  const cardsData = [
    {
      title: "Total Cost",
      value: total,
      trendDescription: "Up from last month",
      changePercentage: costIncreasePercentage,
      trendDirection: "up",
      icon:<MdOutlineTrendingUp size={20} className={`${typeof costIncreasePercentage === "number" && costIncreasePercentage >= 0 ? "text-[#4DAA4A]" : "text-red-500"}`} />,
      badge:<AiFillDollarCircle size={35} className="text-primary" />,
    },
    {
      title: "Active Students",
      value: totalClient, // Using number type when possible
      trendDescription: "Up from last month",
      changePercentage: clientsIncreasePercentage,
      trendDirection: "up",
      icon:<MdOutlineTrendingUp size={20} className={`${typeof clientsIncreasePercentage === "number" && clientsIncreasePercentage >= 2 ? "text-[#4DAA4A]" : "text-red-500"}`} />,
      badge:<img src={users} className="w-10" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* <!-- Metric Item Start --> */}
      {cardsData.map((card, index) => (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-3" key={index}>
          <h1 className="text-2xl font-bold text-[#4D4D4D]">{card.title}</h1>
          <div className="mt-5">
            <div className="flex justify-between items-center">
              <h4 className="mt-2 font-bold text-gray-800 text-2xl">
              {card.value}
              </h4>
              {card.badge}
            </div>
            <div className="mt-5">
              <div className="flex items-center gap-1">
                {card.icon}
                <span className="text-sm">{typeof card.changePercentage === 'number' ? card.changePercentage.toFixed(2) : 0}%</span>
                <span className="text-sm">{card?.trendDescription}</span>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
