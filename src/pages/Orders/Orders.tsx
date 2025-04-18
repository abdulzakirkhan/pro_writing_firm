import { useEffect, useState } from "react";
import { useTitle } from "../../context/TitleContext";
import { MdOutlineTrendingUp, MdShoppingCartCheckout } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import { IoChevronBack } from "react-icons/io5";
import OrderCard from "../../components/OrderCard/OrderCard";
import FilterSection from "../../components/filter/FilterSection";
import PaymentCard from "../../components/PaymentCard/PaymentCard.js";
import paymentIcon from "../../../icons/payment.png";
import paymentsuccess from "../../assets/icons/paymentsuccess.png";
export default function Orders() {
  const { setTitle } = useTitle();
  const [makePayment, setMakePayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [step, setStep] = useState(1);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

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
  const cardData = [
    {
      id: 1,
      batchName: "Batch 01",
      fileCount: "4/5",
      subject: "Bachelors - Computer Science",
      itemsCount: 5,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "partially paid",
      statusColor: "#F4A825",
      borderColor: "#F76631",
    },
    {
      id: 2,
      batchName: "Batch 02",
      fileCount: "2/4",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Paid",
      statusColor: "#3BB537",
      borderColor: "#FBB343",
    },
    {
      id: 3,
      batchName: "Batch 03",
      fileCount: "2/3",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Unpaid",
      statusColor: "#FF5C5C",
      borderColor: "#57C063",
    },
    {
      id: 4,
      batchName: "Batch 03",
      fileCount: "2/3",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Unpaid",
      statusColor: "#FF5C5C",
      borderColor: "#57C063",
    },
    {
      id: 5,
      batchName: "Batch 02",
      fileCount: "2/4",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Paid",
      statusColor: "#3BB537",
      borderColor: "#FBB343",
    },
    {
      id: 6,
      batchName: "Batch 01",
      fileCount: "4/5",
      subject: "Bachelors - Computer Science",
      itemsCount: 5,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "partially paid",
      statusColor: "#F4A825",
      borderColor: "#F76631",
    },
  ];

  const togglePaymentMethod = () => {
    setPaymentMethod(!paymentMethod);
  };

  const makePaymentHandle = () => {
    setMakePayment(!makePayment);
  };
  const toggleSelect = (id: number) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  function ChoosePaymentMethod({ onNext }: { onNext: () => void }) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-12">
        {/* Left Card */}
        <div className="w-full lg:col-span-7 bg-white rounded-xl p-6 shadow">
          <h2 className="text-center text-teal-700 font-semibold text-lg mb-6">
            Payment Method
          </h2>
          <div className="border-[2px] flex flex-col justify-center gap-4 h-[123px] border-[#C6BCBC] mb-6 px-4 py-3 rounded-lg ">
            <div className="flex justify-between items-center">
              {/* Wallet Icon + Label */}
              <div className="flex items-center gap-3">
                <div className="text-xl text-gray-600">
                  {/* Replace with a real icon if you use one like react-icons */}
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v2H2V6zm0 4h20v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8zm14 2a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  Wallet
                </span>
              </div>

              {/* Availability + Toggle */}
              <div className="flex flex-col items-end">
                {/* Toggle switch */}
                <label className="inline-flex items-center cursor-pointer mt-1">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-700 after:border-[#C6BCBC] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600 relative" />
                </label>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-green-500 text-sm font-medium">
                Available:
              </span>
              <span className="text-green-600 font-semibold text-sm">$100</span>
            </div>
          </div>

          {/* Card form */}
          <div className="space-y-4">
            <div className="relative">
              <input
                placeholder="1234 1234 1234 1234"
                className="w-full border border-[#C6BCBC] px-3 py-4 focus:rounded-none outline-none text-sm placeholder-gray-400 pr-14"
              />
              {/* Card logos */}
              <img
                src={paymentIcon} // make sure you have this file
                alt="Card logos"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 w-[40px]"
              />
            </div>

            <div className="flex gap-4">
              <input
                placeholder="CVC"
                className="w-1/2 border border-[#C6BCBC] outline-none px-3 py-4 text-sm placeholder-gray-400"
              />
              <input
                placeholder="MM/YY"
                className="w-1/2 border border-[#C6BCBC] outline-none px-3 py-4 text-sm placeholder-gray-400"
              />
            </div>

            <button
              onClick={onNext}
              className="bg-teal-600 text-white w-full py-2 outline-none mt-4 hover:bg-teal-700 transition"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Summary */}
        <div className="w-full lg:col-span-5 h-[278px]  bg-white rounded-xl p-4 shadow">
          <h3 className="text-md font-bold my-4 text-center text-2xl text-[#13A09D]">Order Summary</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6D6D6D] text-lg">Price:</span>
              <span>$150</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6D6D6D] text-lg">Processing fee (4%):</span>
              <span>$6</span>
            </div>
            <div className="flex justify-between line-through text-gray-400">
              <span>VAT (20%):</span>
              <span>$30</span>
            </div>
            <hr />
            <div className="flex text-[#13A09D] justify-between font-bold text-lg">
              <span>Total:</span>
              <span>$156</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function OrderSummary({
    onNext,
    onBack,
  }: {
    onNext: () => void;
    onBack: () => void;
  }) {
    return (
      <>
      <div className="mx-auto bg-white p-6 shadow rounded-xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-teal-700 mb-4">
          Order Summary
        </h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-[#6D6D6D] text-lg">Price:</span>
            <span>$150</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6D6D6D] text-lg">Processing fee (4%):</span>
            <span>$6</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Wallet:</span>
            <span className="text-red-600">- $100</span>
          </div>
          <hr />
          <div className="flex border-b justify-between text-lg font-bold">
            <span className="text-[#13A09D]">Total:</span>
            <span className="text-[#13A09D]">$56</span>
          </div>
          <div className="text-sm flex justify-between items-center text-gray-500 mt-2">
            Payment Method: <span> **** **** **** 1234</span>
          </div>
        </div>
      </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={onNext}
            className="bg-teal-600 text-white px-6 py-2 rounded"
          >
            Pay Now
          </button>
        </div>
      </>
    );
  }

  function PaymentSuccess() {
    const backToOrders =() => {
      setMakePayment(false)
      setPaymentMethod(false)
    }
    return (
      <div className="flex justify-center">
        <div className="flex flex-col w-[300px] items-center justify-center text-center">
          <img
            src={paymentsuccess}
            alt="success"
            className="w-[300px] mb-6"
          />
          <h2 className="text-2xl font-bold text-teal-700 mb-2">
            Payment Successful
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Your payment was successful. Sit back and relax while we handle the
            rest.
          </p>
          <button onClick={backToOrders} className="bg-teal-600 w-full text-white px-6 py-2 rounded-lg">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }
  useEffect(() => {
    setTitle("My Orders");
  }, [setTitle]);
  return (
    <>
      {makePayment ? (
        <>
          {paymentMethod ? (
            <>
              <div className="max-w-3xl mx-auto py-10 px-4">
                <div className="relative flex justify-between items-center mb-10 px-4">
                  {[
                    "Choose payment Method",
                    "Order Summary",
                    "Payment Successful",
                  ].map((label, index, arr) => {
                    const isActive = step > index;
                    const isCurrent = step === index + 1;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center relative z-10"
                      >
                        {/* Line to the right */}
                        {index < arr.length - 1 && (
                          <div className="absolute top-2 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                        )}
                        {/* Line filled until current */}
                        {index < step - 1 && (
                          <div className="absolute top-2 left-1/2 w-full h-0.5 bg-[#13A09D] -z-10 transition-all duration-300"></div>
                        )}

                        {/* Dot */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${
              isCurrent
                ? "bg-[#13A09D] border-[#13A09D]"
                : "bg-white border-gray-400"
            }`}
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              isCurrent || isActive
                                ? "bg-[#13A09D]"
                                : "bg-gray-400"
                            }`}
                          ></div>
                        </div>

                        {/* Label */}
                        <p
                          className={`mt-2 text-xs text-center ${
                            isCurrent
                              ? "text-[#13A09D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content */}
              {step === 1 && <ChoosePaymentMethod onNext={goNext} />}
              {step === 2 && <OrderSummary onNext={goNext} onBack={goBack} />}
              {step === 3 && <PaymentSuccess />}
            </>
          ) : (
            <>
              <div className="mt-12">
                <div className="">
                  <button
                    onClick={() => setMakePayment(!makePayment)}
                    className="flex text-[#13A09D] items-center gap-1 text-lg font-semibold"
                  >
                    <IoChevronBack size={24} />
                    Back
                  </button>
                </div>
                <FilterSection
                  title="Select Orders to Make Payment"
                  onClick={togglePaymentMethod}
                  navigate={false}
                  btnTitle={"Make Payment"}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-12">
                {cardData.map((order, index) => {
                  const isSelected = selectedOrders.includes(order?.id);
                  return (
                    <PaymentCard
                      key={index}
                      order={order}
                      onClick={toggleSelect}
                      isSelected={isSelected}
                    />
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 lg:col-span-5 xl:col-span-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
                {orderSummary.map((order, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl w-full border-2 border-[#C6BCBC] bg-white p-5 md:p-3 ${
                      index === 0 ? "lg:col-span-12" : "lg:col-span-6"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold text-[#4D4D4D]">
                        {order.title}
                      </h1>
                      <div
                        className={`w-[47px] h-[48px] flex justify-center items-center rounded-full
          ${order.title === "Complete" ? "bg-[#C4E9C3] text-[#3BB537]" : ""}
          ${order.title === "In Progress" ? "bg-[#F2E4CF] text-[#FCAE30]" : ""}
          ${index === 0 ? "bg-[#CDEBEA] text-[#13A09D]" : ""}`}
                      >
                        {order.icon}
                      </div>
                    </div>

                    <div className="mt-5">
                      <h4 className="mt-2 font-bold text-gray-800 text-2xl">
                        {order.value}
                      </h4>
                      <div className="mt-5">
                        <div className="flex items-center gap-1">
                          {order.badge}
                          <span
                            className={`text-sm text-[${order.trend.color}]`}
                          >
                            {order.trend.percent} {order.trend.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 border-2 bg-white rounded-xl shadow">
              <BarChartOne title="Orders" />
            </div>

            <div className="col-span-12 lg:col-span-4 border-2 bg-white rounded-xl shadow">
              <BarChartOne title="Marks" />
            </div>
          </div>

          <div className="mt-12">
            <FilterSection
              onClick={makePaymentHandle}
              navigate={true}
              btnTitle={"Payment"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-8">
            {cardData.map((card, idx) => (
              <OrderCard key={idx} {...card} onClick={null} payment={false} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
