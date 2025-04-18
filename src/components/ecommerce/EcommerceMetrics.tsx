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
export default function EcommerceMetrics() {
  const cardsData = [
    {
      title: "Total Cost",
      value: "1,040",
      trendDescription: "Increased from last month",
      changePercentage: "8.5%",
      trendDirection: "up",
      icon:<MdOutlineTrendingUp size={30} className="text-[#4DAA4A]" />,
      badge:<AiFillDollarCircle size={35} className="text-primary" />,
    },
    {
      title: "Active Clients",
      value: 30, // Using number type when possible
      trendDescription: "Slight increase from last month",
      changePercentage: "0.5%",
      trendDirection: "up",
      icon:<MdOutlineTrendingUp size={30} className="text-[#4DAA4A]" />,
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
                11.01%
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
