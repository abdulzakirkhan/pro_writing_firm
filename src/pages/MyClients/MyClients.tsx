import { SetStateAction, useEffect, useRef, useState } from "react";
import { useTitle } from "../../context/TitleContext";
import ClientFilter from "../../components/ClientFilter/ClientFilter";
import OrderSubjectChart from "../../components/OrderSubjectChart/OrderSubjectChart";
import SubjectPieChart from "../../components/charts/SubjectPieChart/SubjectPieChart";
import ClientList from "../../components/ClientList/ClientList";
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
  FaClipboardList,
  FaDollarSign,
  FaFilter,
  FaInfoCircle,
  FaListAlt,
} from "react-icons/fa";
import {
  MdInfoOutline,
  MdShoppingCartCheckout,
  MdWorkHistory,
} from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { PiGraduationCapDuotone } from "react-icons/pi";
import { MdOutlineTrendingUp } from "react-icons/md";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import FilterSection from "../../components/ClientFilter/ClientFilter";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import MyClientOrders from "../../components/MyClientOrders/MyClientOrders";
export default function MyClients() {
  const [clientProfile, setClientProfile] = useState(false);
  const [myClientOrders, setMyClientOrders] = useState(false);
  const { setTitle } = useTitle();
  const [clientData, setClientData] = useState();

  // filter and filter dropdown
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleClickProfile = (client: SetStateAction<never[]>) => {
    setClientData(client);
  };
  const orderSummary = [
    {
      title: "Total Order",
      value: 50,
      icon: <MdShoppingCartCheckout size={25} />, // or use your own icon mapping
      trend: {
        percent: "8.5%",
        direction: "up",
        color: "#13A09D",
        description: "Up from yesterday",
      },
      badge: <MdOutlineTrendingUp size={28} className="text-[#13A09D]" />,
    },
    {
      title: "In Progress",
      value: 5,
      icon: <MdWorkHistory className="text-[#FCAE30]" size={25} />, // assuming camera icon in orange
      trend: {
        percent: "1.3%",
        direction: "up",
        color: "#FCAE30",
        description: "Up from yesterday",
      },
      badge: <MdOutlineTrendingUp size={28} className="text-[#FCAE30]" />,
    },
    {
      title: "Complete",
      value: 45,
      icon: <FaClipboardList className="text-[#3BB537]" size={25} />, // green clipboard icon
      trend: {
        percent: "1.8%",
        direction: "up",
        color: "#3BB537",
        description: "Up from yesterday",
      },
      badge: <MdOutlineTrendingUp size={28} className="text-[#3BB537]" />,
    },
  ];
  console.log("clientData :", clientData);

  const Mainlabels = ["Jan", "Feb", "March", "April", "May", "June", "July"];
  const Maindatasets = [
    {
      label: "OOP",
      data: [30, 0, 0, 40, 0, 20, 30],
      backgroundColor: "#0DA8D8",
    },
    {
      label: "Data Structures",
      data: [20, 10, 10, 15, 0, 10, 0],
      backgroundColor: "#A3D79A",
    },
    {
      label: "Business",
      data: [10, 10, 5, 10, 0, 5, 0],
      backgroundColor: "#FBB343",
    },
    {
      label: "English",
      data: [5, 0, 5, 10, 20, 5, 0],
      backgroundColor: "#F76631",
    },
    {
      label: "Essay writing",
      data: [10, 0, 5, 5, 0, 0, 0],
      backgroundColor: "#D33316",
    },
    {
      label: "Calculus",
      data: [4, 8, 5, 5, 0, 0, 0],
      backgroundColor: "#FCAE30",
    },
  ];
  const labels = ["Jan", "Feb", "March", "April", "May", "June", "July"];
  const datasets = [
    {
      label: "Artificial Intelligence",
      data: [30, 50, 70, 95, 85, 65, 75],
      backgroundColor: "#0DA8D8",
    },
    {
      label: "OOP",
      data: [40, 50, 60, 90, 75, 35, 70],
      backgroundColor: "#A3D79A",
    },
    {
      label: "English",
      data: [10, 0, 15, 5, 45, 0, 0],
      backgroundColor: "#D33316",
    },
    { label: "DS", data: [95, 0, 85, 0, 65, 0, 0], backgroundColor: "#FBB343" },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };
  const orders = [
    {
      percentage: 100,
      topic: "Impact Of Artificial Intelligence...",
      orderId: "1434323",
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      marks: 90,
      price: 10.0,
      status: "paid",
    },
    {
      percentage: 47,
      topic: "Impact Of Artificial Intelligence...",
      orderId: "1434323",
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      marks: 90,
      price: 10.0,
      status: "unpaid",
    },
    {
      percentage: 20,
      topic: "Impact Of Artificial Intelligence...",
      orderId: "1434323",
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      marks: 90,
      price: 10.0,
      status: "unpaid",
    },
  ];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setTitle("My Clients");
  }, [setTitle]);
  return (
    <>
      {clientProfile ? (
        <>
          {myClientOrders ? (
            <>
              <div className="flex px-6 justify-between items-center w-full">
                <button onClick={() => setMyClientOrders(!myClientOrders)} className="flex items-center text-[#13A09D] gap-1 text-xl">
                  <MdKeyboardArrowLeft size={30} />
                  Back
                </button>

                <div className="flex gap-2 items-center relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="px-6 py-2 text-sm border-2 border-[#B9AFAF] rounded"
                    />
                    <IoSearch className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md shadow"
                  >
                    <FaFilter /> Filter
                  </button>

                  {isOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 top-[110%] bg-white rounded-md shadow-lg p-4 z-50 w-[230px]"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Filters
                        </span>
                        <button
                          onClick={() => setSelectedFilters([])}
                          className="text-teal-500 text-sm font-medium"
                        >
                          Clear all
                        </button>
                      </div>

                      {/* Filter Options */}
                      {[
                        "High to Low Marks",
                        "Low to High Marks",
                        "Paid Orders",
                        "Unpaid Orders",
                      ].map((filter) => (
                        <div
                          key={filter}
                          className="flex justify-between items-center cursor-pointer text-sm py-1"
                          onClick={() => toggleFilter(filter)}
                        >
                          <span>{filter}</span>
                          <span
                            className={`h-4 w-4 rounded border border-gray-300 ${
                              selectedFilters.includes(filter)
                                ? "bg-gray-400"
                                : ""
                            }`}
                          />
                        </div>
                      ))}

                      {/* Dropdown Sections */}
                      {["Type of Paper", "Category", "Academic Level"].map(
                        (item) => (
                          <div key={item} className="pt-2">
                            <button
                              onClick={() => toggleDropdown(item)}
                              className="flex justify-between w-full text-sm font-medium"
                            >
                              {item}
                              {openDropdown === item ? (
                                <IoMdArrowDropup />
                              ) : (
                                <IoMdArrowDropdown />
                              )}
                            </button>
                            {openDropdown === item && (
                              <div className="pl-4 pt-2 text-xs text-gray-600 space-y-1">
                                <p>Option 1</p>
                                <p>Option 2</p>
                                <p>Option 3</p>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-12 py-8">
                <div className="col-span-2">
                  <h1 className="text-3xl font-bold">Orders List</h1>
                </div>
                {orders.map((order,index) =>(
                  <MyClientOrders key={index} {...order} />
                ))}
              </div>


            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="w-full lg:col-span-12 py-3">
                <button
                  onClick={() => setClientProfile(false)}
                  className="flex items-center text-[#13A09D] gap-1 text-xl"
                >
                  <MdKeyboardArrowLeft size={30} />
                  Back
                </button>
              </div>
              <div className="w-full lg:col-span-4">
                <div className="bg-white rounded-2xl h-full shadow-md p-6">
                  <h2 className="text-center text-gray-600 text-2xl font-medium mb-4">
                    Client’s Profile
                  </h2>

                  {/* Avatar & Basic Info */}
                  <div className="flex justify-center gap-8 mt-12 items-center">
                    <img
                      src={clientData?.avatar}
                      alt="Client"
                      className="w-[100px] h-[100px] rounded-full border-3 border-teal-500 object-cover"
                    />
                    <div className="">
                      <p className="mt-3 font-bold text-lg text-black">
                        {clientData?.name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <img
                          src={clientData?.icon}
                          alt=""
                          className="w-[24px] h-[24px]"
                        />
                        <span className="text-lg">
                          {clientData?.university}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                        <PiGraduationCapDuotone size={27} />{" "}
                        <span className="text-lg">{clientData?.education}</span>
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex justify-center gap-4 mt-8">
                    <div className="">
                      <p className="text-xs px-1 text-gray-800 font-semibold mt-1">
                        Performance
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="flex gap-2 items-center">
                          <MdOutlineTrendingUp
                            size={28}
                            className={`${
                              clientData?.performance >= 5
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          />{" "}
                          <span className="font-bold">
                            {clientData?.performance}%
                          </span>
                        </span>{" "}
                        <span className="font-bold">Up from last month</span>{" "}
                      </p>
                    </div>

                    <div className="">
                      <p className="text-xs text-gray-800 font-semibold mt-1">
                        Orders
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="flex gap-2 items-center">
                          <MdOutlineTrendingUp
                            size={28}
                            className={`${
                              clientData?.orders >= 5
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          />{" "}
                          <span className="font-bold">
                            {clientData?.orders}%
                          </span>
                        </span>{" "}
                        <span className="font-bold">Up from last month</span>{" "}
                      </p>
                    </div>
                  </div>

                  {/* Credentials Section */}
                  <div className="border rounded-md p-4 mt-12">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">
                      Credentials:
                    </h3>
                    <label className="block text-sm text-black font-semibold mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={clientData?.email}
                      className="w-full px-3 py-2 mb-3 border rounded outline-none text-sm"
                    />
                    <label className="block text-sm text-black font-semibold mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={clientData?.password}
                      className="w-full px-3 py-2 mb-3 border rounded outline-none text-sm"
                    />

                    {/* Info Text */}
                    <div className="flex items-start text-xs text-gray-600 mb-4">
                      <FaInfoCircle size={40} className="text-teal-500 mr-1" />
                      <p className="mt-1 text-sm">
                        Share your credentials with the client to enable direct
                        communication through the chat feature.
                      </p>
                    </div>

                    <div className="flex justify-center items-center">
                      <button className="bg-teal-600 w-[92px] text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2">
                        Share <FaShareAlt size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:col-span-8 h-full">
                <div className="flex w-full gap-2 pb-6 items-center">
                  {/* View Orders Card */}
                  <div
                    onClick={() => setMyClientOrders(true)}
                    className="flex justify-between lg:w-1/2 items-center h-[140px] bg-[#157BA7] text-white rounded-lg px-6 py-4 shadow-md"
                  >
                    <div className="text-lg font-semibold">View Orders</div>
                    <FaListAlt size={24} className="text-white" />
                  </div>

                  {/* Outstanding Balance Card */}
                  <div className="flex justify-between items-center lg:w-2/3 h-[140px] bg-[#13A09D] text-white rounded-lg px-6 py-4 shadow-md">
                    <div className="flex flex-col gap-4">
                      <p className="text-sm">Outstanding Balance:</p>
                      <p className="text-2xl font-bold">$20</p>
                    </div>
                    <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center">
                      <FaDollarSign className="text-[#13A09D]" size={16} />
                    </div>
                  </div>
                </div>

                <div className="!flex !items-center !gap-4 w-full">
                  {orderSummary.map((order, index) => (
                    <OrderSummary
                      key={index}
                      className={"lg:w-1/3"}
                      order={order}
                      index={index}
                    />
                  ))}
                </div>

                <div className="p-5 mt-3 border-2 border-[#C6BCBC] rounded-2xl h-[380px] bg-white">
                  <OrderSubjectChart
                    labels={labels}
                    stacked={false}
                    datasets={datasets}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <ClientFilter title="Client List" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-8">
            <div className="w-full lg:col-span-5">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-white rounded-xl p-4 shadow h-[380px]">
                  <OrderSubjectChart
                    labels={Mainlabels}
                    stacked={true}
                    datasets={Maindatasets}
                  />
                </div>
                <div className="lg:h-[380px]  flex justify-center items-center">
                  <SubjectPieChart />
                </div>

              </div>
            </div>
            <div className="w-full lg:col-span-7">
              <ClientList
                handleClickProfile={handleClickProfile}
                clientProfileOpen={setClientProfile}
                clientProfile={clientProfile}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
