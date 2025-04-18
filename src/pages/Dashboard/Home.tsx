import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import CostComparisonChart from "../../components/charts/area/CostComparisonChart.js";
import OrdersBarChart from "../../components/charts/grouped/OrdersBarChart.js";
import BatchWiseScatterChart from "../../components/scatter/BatchWiseScatterChart.js";
import CreditUsageChart from "../../components/credit/CreditUsageChart.js";
import BatchAverageOverview from "../../components/charts/pie/BatchAverageOverview.js";
// import PageMeta from "../../components/common/PageMeta";

import { FaFilter } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { HiMiniChartBarSquare } from "react-icons/hi2";
import { useTitle } from "../../context/TitleContext.js";
import { useSelector } from "react-redux";
import {AppState} from "../../redux/store"
// import { useGetAgentAllClientsQuery } from "../../redux/agentdashboard/agentDashboardApi";
import {useGetStandardValuesQuery} from "../../redux/agentdashboard/agentApi";
import {useGetAgentCostDataQuery} from "../../redux/agentdashboard/agentApi";
export default function Home() {
  const { setTitle  } = useTitle();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user);
  const token = useSelector((state: AppState) => state.auth.token);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  let payload = {
    agentId: user?.agent_user_id,
    // university: selectedUniversity,
    batch: selectedBatches,
    startDate: startDate,
    endDate: endDate,
  };
  const batches = ["Batch 01", "Batch 05", "Batch 04", "Batch 10"];
  const { data: agentCostData, isLoading: agentCostLoading,  error, } = useGetAgentCostDataQuery();

  const toggleBatch = (batch: string) => {
    setSelectedBatches((prev) =>
      prev.includes(batch) ? prev.filter((b) => b !== batch) : [...prev, batch]
    );
  };
console.log("selectedBatches",selectedBatches)
  const items = [
    {
      icon: <FaSyncAlt className="text-[#13A09D]" />,
      title: "Current Month",
      subtitle: "July",
      value: "$500",
      valueColor: "text-green-600",
    },
    {
      icon:<HiMiniChartBarSquare size={25} className="text-[#137DA0]" />,
      title: "Peak Order Cost",
      subtitle: "March",
      value: "$600",
      valueColor: "text-[#1E8AD3]",
    },
  ];

  


  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };


  const getAgentDashboardData= async() => {
    
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = dropdownRef.current;
      const button = buttonRef.current;

      // If click is outside both dropdown AND button, close it
      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setTitle('Dashboard');
    getAgentDashboardData()
  }, []);
  return (
    <>
      {/* <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <div className="flex flex-wrap justify-between py-5">
        <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>

        <div className="flex items-center gap-2 relative">
          <div className="relative w-full max-w-xs">
            <input
              type="text" 
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>

          <div className="relative">
            <button
              ref={buttonRef}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md shadow hover:bg-orange-700"
              onClick={handleToggle}
            >
              <FaFilter />
              Filter
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Date range</span>
                  <button className="text-teal-600 text-sm font-medium">
                    Clear all
                  </button>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded shadow-sm text-sm"
                    placeholder="From"
                  />
                  <input
                    type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded shadow-sm text-sm"
                    placeholder="To"
                  />
                </div>

                <div className="mb-4">
                  <button className="flex items-center justify-between w-full text-sm font-medium">
                    Any University <IoMdArrowDropdown />
                  </button>
                </div>

                <div>
                  <button className="flex items-center justify-between w-full text-sm font-medium mb-2">
                    Batch <IoMdArrowDropdown />
                  </button>
                  <div className="border rounded p-2 space-y-2">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setSelectedBatches(["All"])}
                    >
                      <span>All</span>
                      <span className="h-4 w-4 rounded bg-teal-600"></span>
                    </div>
                    {batches.map((batch) => (
                      <div
                        key={batch}
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleBatch(batch)}
                      >
                        <span>{batch}</span>
                        <span
                          className={`h-4 w-4 rounded ${
                            selectedBatches.includes(batch)
                              ? "bg-gray-400"
                              : "border border-gray-300"
                          }`}
                        ></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 space-y-3 xl:col-span-5">
          <EcommerceMetrics />

          {/* <MonthlySalesChart /> */}
          <div className="bg-white p-3 rounded-lg">
            <CostComparisonChart />
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white px-4 py-2 rounded-md shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded">{item.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#137DA0]">{item.subtitle}</p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${item.valueColor}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <div className="bg-white h-[240px] rounded-lg">
            <OrdersBarChart />
          </div>

          <div className="bg-white rounded-lg py-3 px-3">
            <h3 className="px-6 text-lg text-primary">Batch wise varations</h3>
            <BatchWiseScatterChart />
          </div>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-3">
          <CreditUsageChart />
          <BatchAverageOverview />
        </div>
      </div>
    </>
  );
}
