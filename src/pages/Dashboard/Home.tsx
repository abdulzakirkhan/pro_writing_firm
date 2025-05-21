import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import CostComparisonChart from "../../components/charts/area/CostComparisonChart.js";
import OrdersBarChart from "../../components/charts/grouped/OrdersBarChart.js";
import BatchWiseScatterChart from "../../components/scatter/BatchWiseScatterChart.js";
import CreditUsageChart from "../../components/credit/CreditUsageChart.js";
import BatchAverageOverview from "../../components/charts/pie/BatchAverageOverview.js";
// import PageMeta from "../../components/common/PageMeta";
// import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";
import { FaFilter } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { HiMiniChartBarSquare } from "react-icons/hi2";
import { useTitle } from "../../context/TitleContext.js";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import {
  useGetAgentClientOrdersBarChartSubjectWiseQuery,
  useGetAgentCreditLimitsQuery,
  useGetAgentOrdersDataMarksQuery,
  useGetAgentOrdersDataQuery,
  useGetCurrentMonthCostQuery,
  useGetPerformanceDataQuery,
  useGetStandardValuesQuery,
  useGetTopClientsDataQuery,
  useGetUniversityAndBatchesQuery,
  useShowBlinkerQuery,
} from "../../redux/agentdashboard/agentApi";
import { useGetAgentCostDataQuery } from "../../redux/agentdashboard/agentApi";
import { convertDateToYYYYMMDD } from "../../config/indext.js";
import Loader from "../../components/Loader/Loader.js";
export default function Home() {
  const {
    data: universityAndBatchData,
    isLoading: universityAndBatchDataLoading,
    error: universityAndBatchDataError,
  } = useGetUniversityAndBatchesQuery();

  const { setTitle } = useTitle();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user);
  const token = useSelector((state: AppState) => state.auth.token);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(
    universityAndBatchData?.result?.universities_data[0]?.id || "All"
  );
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const universities = universityAndBatchData?.result?.universities_data || [];
  const [showBatches, setShowBatches] = useState(false);
  const currentDate = new Date();
  const toDate = currentDate;
  const fromDate = new Date(toDate);
  fromDate.setFullYear(toDate.getFullYear() - 1);

  // State to hold the selected dates
  const [startDate, setStartDate] = useState(
    fromDate.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(toDate.toISOString().split("T")[0]);
  let payload = {
    agentId: user?.agent_user_id,
    university: selectedUniversity,
    batch: selectedBatches.length >= 1 ? selectedBatches : "All",
    startDate: convertDateToYYYYMMDD(startDate),
    endDate: convertDateToYYYYMMDD(endDate),
  };

  const { data: agentCreditLimit ,isLoading: agentCreditLimitLoading,error: agentCreditLimitError,} = useGetAgentCreditLimitsQuery(
    user?.agent_user_id
  );
  const { data: agentCostData, isLoading: agentCostLoading } =
    useGetAgentCostDataQuery(payload);
  const graphData = agentCostData?.result?.graph_data || [];
  const { data: currentMonthCost } = useGetCurrentMonthCostQuery(
    user?.agent_user_id
  );
  const batches = universityAndBatchData?.result?.batch_data || "";
  const { data: performaceData, isLoading: performaceDataLoading } =
    useGetPerformanceDataQuery(payload);
  const performaneGraphData = performaceData?.result?.graph_data || [];
  const toggleBatch = (batch: { id: string }) => {
    if (batch.id === "0") {
      const allBatchIds = batches
        .filter((b: { id: string }) => b.id !== "0")
        .map((b: { id: string }) => String(b.id)); // ensure ids are strings

      setSelectedBatches(allBatchIds);
    } else {
      setSelectedBatches((prev) =>
        prev.includes(String(batch.id))
          ? prev.filter((b) => b !== String(batch.id))
          : [...prev, String(batch.id)]
      );
    }
  };


  const monthNames = [
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
  const currentMonthName = monthNames[new Date().getMonth()];
  const peakOrderCost = agentCostData?.result?.highest_price || 0;
  const currentMonth = agentCostData?.result?.current_month_cost || 0;
  // const [total, setTotal] = useState(agentCostData?.result?.total_cost || 0)
  const items = [
    {
      icon: <FaSyncAlt className="text-[#6da5f9]" />,
      title: "Current Month",
      subtitle: currentMonthName,
      value: currentMonth,
      valueColor: "text-green-600",
    },
    {
      icon: <HiMiniChartBarSquare size={25} className="text-[#8852EE]" />,
      title: "Peak Order Cost",
      subtitle: "March",
      value: peakOrderCost,
      valueColor: "text-[#1E8AD3]",
    },
  ];

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const creditLimit =
    agentCreditLimit?.result?.credit_data?.total_credit_limit > 0
      ? agentCreditLimit?.result?.credit_data?.total_credit_limit
      : 0;

  const usedCredit =
    agentCreditLimit?.result?.credit_data?.used_credit > 0
      ? agentCreditLimit?.result?.credit_data?.used_credit
      : 0; // Used credit

  const availableCredit = agentCreditLimit?.result?.credit_data?.avaible_limit > 0 ? agentCreditLimit?.result?.credit_data?.avaible_limit: 0;

  const handleClearSearch = () => {
    setSelectedBatches([]);
    setSelectedUniversity(null);
  };

  const total = agentCostData?.result?.total_cost ?? 0;
  const totalClient = agentCostData?.result?.total_client ?? 0;
  const costIncreasePercentage =
    agentCostData?.result?.cost_increase_percentage ?? 0;
  const clientsIncreasePercentage =
    agentCostData?.result?.cost_increase_percentage ?? 0;

    // const [total, setTotal] = useState(agentCostData?.result?.total_cost || 0)
    // const [totalClient, setTotalClient] = useState(agentCostData?.result?.total_client || 0)
    // const [costIncreasePercentage, setCostIncreasePercentage] = useState(agentCostData?.result?.cost_increase_percentage || 0)
    // const [clientsIncreasePercentage, setClientsIncreasePercentage] = useState(agentCostData?.result?.cost_increase_percentage || 0)

  const {
    data: showBlinker,
    isLoading: showBlinkerLoading,
    error: showBlinkerError,
  } = useShowBlinkerQuery(user?.agent_user_id);
  const {
    data: topClientsData,
    isLoading: topClientsDataLoading,
    error: topClientsDataError,
  } = useGetTopClientsDataQuery(user?.agent_user_id);
  const pieChartData = topClientsData?.result?.pie_chart || [];

  const blinker = Number(showBlinker?.result?.show_blinker_true || 0);
  const blinker_text = showBlinker?.result?.blinker_text || "";

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
    setTitle("Dashboard");
  }, []);
  const CustomInput = ({ value, onClick, placeholderText }) => (
    <button 
      onClick={onClick}
      className="flex justify-between items-center ms-2 w-full px-3 py-1 border rounded shadow-sm text-sm bg-white"
    >
      {value || placeholderText}
      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
    </button>
  );

  if(topClientsDataLoading || showBlinkerLoading || performaceDataLoading || agentCostLoading || agentCreditLimitLoading){
    return(
      <div className="w-full md:h-[80vh]">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6986F5]"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      {blinker >= 1 && (
        <div className="mb-2">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-red-50 border-2 border-red-300 rounded-md shadow-sm">
            <span className="h-3.5 w-3.5 rounded-full bg-red-600 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] ring-2 ring-red-200" />
            <span className="text-sm font-semibold text-red-600 tracking-tight">
              {blinker_text}
            </span>
          </div>
        </div>
      )}

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
                  <button
                    onClick={handleClearSearch}
                    className="text-teal-600 text-sm font-medium"
                  >
                    Clear all
                  </button>
                </div>

                {/* <div className="flex z-50 gap-2 mb-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-3 py-1 border z-50 rounded shadow-sm text-sm"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded shadow-sm text-sm"
                  />
                </div> */}
                <div className="flex z-50 gap-2 mb-4">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date?.toISOString())}
                    customInput={<CustomInput placeholderText="Start Date" />}
                    dateFormat="yyyy-MM-dd"
                  />
                  <DatePicker
                    selected={endDate} placeholderText="TO"
                    onChange={(date) => setEndDate(date?.toISOString())}
                    customInput={<CustomInput placeholderText="End Date" />}
                    dateFormat="yyyy-MM-dd"
                    popperPlacement="bottom-start"
                  />
                </div>

                <div className="mb-4">
                  <button
                    onClick={() =>
                      setShowUniversityDropdown(!showUniversityDropdown)
                    }
                    className="flex items-center justify-between w-full text-sm font-medium"
                  >
                    {selectedUniversity || "Any University"}{" "}
                    <IoMdArrowDropdown />
                  </button>
                  {showUniversityDropdown && (
                    <div className="border max-h-48 overflow-y-auto rounded p-2 mt-1 space-y-1 bg-white shadow">
                      {universities.map((uni) => (
                        <div
                          key={uni?.id}
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => {
                            setSelectedUniversity(uni?.id);
                            setShowUniversityDropdown(false);
                          }}
                        >
                          {uni?.uni_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setShowBatches(!showBatches)}
                    className="flex items-center justify-between w-full text-sm font-medium mb-2"
                  >
                    Batch <IoMdArrowDropdown />
                  </button>
                  {showBatches && (
                    <div className="border rounded p-2 space-y-2">
                      {batches.map((batch) => (
                        <div
                          key={batch?.id}
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleBatch(batch)}
                        >
                          <span>{batch?.batch_name}</span>
                          <span
                            className={`h-4 w-4 rounded ${
                              selectedBatches.includes(batch?.id)
                                ? "bg-gray-400"
                                : "border border-gray-300"
                            }`}
                          ></span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 space-y-3 xl:col-span-5">
          <EcommerceMetrics
            total={total}
            totalClient={totalClient}
            costIncreasePercentage={costIncreasePercentage}
            clientsIncreasePercentage={clientsIncreasePercentage}
          />

          {/* <MonthlySalesChart /> */}
          <div className="bg-white p-3 rounded-lg">
            {graphData ? (
              <CostComparisonChart graphData={graphData} />
            ) : (
              <Loader />
            )}
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
                    <p className="text-xs font-semibold text-[#8852EE]">{item.subtitle}</p>
                  </div>
                </div>
                <div className={`text-sm font-bold text-[#4DAA4A]`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <div className="bg-white h-[240px] rounded-lg">
            <OrdersBarChart performaneGraphData={performaneGraphData} />
          </div>

          <div className="bg-white rounded-lg py-3 px-3">
            <h3 className="px-6 text-lg text-primary">Batch wise varations</h3>
            <BatchWiseScatterChart />
          </div>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-3">
          <CreditUsageChart
            creditLimit={creditLimit}
            usedCredit={usedCredit}
            availableCredit={availableCredit}
          />
          <BatchAverageOverview pieChartData={pieChartData} />
        </div>
      </div>
    </>
  );
}
