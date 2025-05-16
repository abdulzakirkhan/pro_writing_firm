import { useEffect, useRef, useState } from "react";
import { useTitle } from "../../context/TitleContext";
import { MdOutlineTrendingUp, MdShoppingCartCheckout } from "react-icons/md";
import { FaClipboardList, FaFilter } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import { IoChevronBack, IoSearch } from "react-icons/io5";
import OrderCard from "../../components/OrderCard/OrderCard";
import FilterSection from "../../components/filter/FilterSection";
import PaymentCard from "../../components/PaymentCard/PaymentCard.js";
import paymentIcon from "../../../icons/payment.png";
import paymentsuccess from "../../assets/icons/paymentsuccess.png";
import html2canvas from "html2canvas";
import {
  useGetAgentOrdersDataMarksQuery,
  useGetAgentOrdersDataQuery,
  useGetAgentOrdersListBatchQuery,
  useGetAgentUnpaidOrdersListBatchQuery,
  useGetPaperSubjectQuery,
  useGetTypeOfPaperQuery,
  useGetUniversityAndBatchesQuery,
} from "../../redux/agentdashboard/agentApi.js";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader.js";
import { getCurrency, getCurrencyNameFromPhone } from "../../config/indext.js";
import {
  useAddCardMutation,
  useAddWalletCardMutation,
  useGetAllCardsQuery,
  useGetAllClientCardsQuery,
  useGetWalletAmountQuery,
  useMakeMeezanPamentLinkMutation,
  useMakeMeezanPaymentMutation,
  useMakePaymentForOrdersMutation,
} from "../../redux/paymentApi/paymentApi.js";
import {
  calculatePaymentFees,
  calculatePaymentVatFees,
  getConsumableAmounts,
  getFormattedPriceWith3,
  getIntOrderConsumableAmnts,
} from "../../helper/helper.js";
import toast, { Toaster } from "react-hot-toast";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import OrderList from "../OrderList/OrderList.js";
import { useGetStandardValuesQuery } from "../../redux/sharedApi/sharedApi.js";
import { useGetProfileQuery } from "../../redux/profileApi/profileApi.js";
import { useGetRewardAmountsQuery } from "../../redux/rewardsApi/rewardsApi.js";
import { useLocation, useNavigate } from "react-router";

interface Category {
  id: any;
  ordercategoryname: any;
}
interface Subject {
  id: any;
  value: any;
}

export default function Orders() {
  const user = useSelector((state) => state.auth?.user);
  const { data: TypeOfPaperData } = useGetTypeOfPaperQuery();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState<Category[]>(
    TypeOfPaperData?.result?.Category_list || [
      { id: "All", ordercategoryname: "All" },
    ]
  );

  // console.log("TypeOfPaperData :",TypeOfPaperData?.result?.Category_list)

  const payload8 = {
    agentId: user?.agent_user_id,
  };
  const {
    data: agentUnpaidOrdersListBatch,
    isLoading: agentUnpaidOrdersListBatchLoading,
    error: agentUnpaidOrdersListBatchError,
  } = useGetAgentUnpaidOrdersListBatchQuery(payload8);
  const {
    data: walletAmount,
    isLoading: walletAmountLoading,
    refetch: walletAmountRefech,
  } = useGetWalletAmountQuery({
    clientId: user?.agent_user_id,
    currency: getCurrency(user?.currency),
  });

  // const availableBalance=walletAmount?.amount
  const [availableBalance, setAvailableBalance] = useState(
    walletAmount?.amount || 0
  );
  const rewardAmount = walletAmount?.rewardsamount;
  const currency = walletAmount?.currency;
  const rewardsamountpluswalletamount =
    walletAmount?.rewardsamountpluswalletamount;

  const batchesDataUnpaid =
    agentUnpaidOrdersListBatch?.result?.batchesData || [];

  const [makePaymentForOrders, { isLoading: makePaymentForOrdersLoading }] =
    useMakePaymentForOrdersMutation();
  const [isChecked, setIsChecked] = useState(false);

  const firstCategory = categories[0] || ["All"];
  // const categories = TypeOfPaperData?.result?.Category_list;
  const subjects = TypeOfPaperData?.result?.Type_of_paperlist || [];
  // const {data: agentOrdersData,isLoading: agentOrdersDataLoading,error,} = useGetAgentOrdersDataQuery();
  const {
    data: universityAndBatchData,
    isLoading: universityAndBatchDataLoading,
    error: universityAndBatchDataError,
  } = useGetUniversityAndBatchesQuery();
  const universities = universityAndBatchData?.result?.universities_data;
  const { setTitle } = useTitle();
  const [selectedUniversity, setSelectedUniversity] = useState(["All"]);
  const [makePayment, setMakePayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [showUniversityDropdown, setShowUniversityDropdown] =
    useState<boolean>(false);
  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  // const {
  //   data: paperSubjectData,
  //   isLoading: paperSubjectDataLoading,
  //   error: paperSubjectDataError,
  // } = useGetPaperSubjectQuery();
  // const [makePayment, { isLoading: makePaymentLoading }] =
  // useMakePaymentMutation();

  const {
    data: getAllClientCards = { result: { result: {} } },
    isLoading: allClientCardsLoading,
    refetch: getAllClientCardsRefech,
  } = useGetAllClientCardsQuery(user?.agent_user_id);
  const [showSubjectDropdown, setShowSubjectDropdown] =
    useState<boolean>(false);
  const firstSubjectValue = subjects?.[0]?.value || "All";
  const [selectedSubject, setSelectedSubject] =
    useState<any>(firstSubjectValue);

  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string[]>([
    "Academic Level",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    ordercategoryname: string;
  } | null>(null);
  const [slectedCatId, setslectedCatId] = useState("All");
  const [selectedCategoryList, setSelectedCategoryList] =
    useState<any[]>(firstCategory);
  let payload = {
    agentId: user?.agent_user_id,
    university: selectedUniversity,
    batch: "All",
    paperSubject: selectedSubject,
  };
  const {
    data: agentOrdersData,
    isLoading: agentOrdersDataLoading,
    error,
  } = useGetAgentOrdersDataQuery(payload);
  const {
    data: agentOrdersDataMarks,
    isLoading: agentOrdersDataMarksLoading,
    error: agentOrdersDataMarksError,
  } = useGetAgentOrdersDataMarksQuery(payload);

  const { data: profileData } = useGetProfileQuery(user?.agent_user_id);
  const { data: rewardAmounts } = useGetRewardAmountsQuery();
  const [makeMeezanPayment, { isLoading: makeMeezanPaymentLoading }] =
    useMakeMeezanPaymentMutation();
  // console.log("getAllClientCards :",getAllClientCards)

  const academicLevels = TypeOfPaperData?.result?.Academic_level;

  const [showAcademicLevel, setShowAcademicLevel] = useState<boolean>(false);
  const [showCategory, setShowCategory] = useState<boolean>(false);

  const totalOrders = agentOrdersData?.result?.Order_count[0]?.Total_orders;
  const completed = agentOrdersData?.result?.Order_count[0]?.total_completed;
  const inProgress = agentOrdersData?.result?.Order_count[0]?.total_inprogress;

  const graphData = agentOrdersData?.result?.graph_data || [];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Sort by numeric month
  const sortedData = [...graphData].sort((a, b) => {
    const monthA = parseInt(a.Month, 10);
    const monthB = parseInt(b.Month, 10);
    return monthA - monthB;
  });

  const labels = sortedData.map((item: any) => {
    const monthIndex = parseInt(item.Month, 10);
    return monthNames[monthIndex];
  });
  const data = sortedData.map((item: any) =>
    parseInt(item.Total_order_month_wise, 10)
  );

  const makrsGraph = agentOrdersDataMarks?.result?.marks_graph_data || [];
  // Sort by numeric month for marks
  const sortedMarksData = [...makrsGraph].sort((a, b) => {
    const monthA = parseInt(a.Month, 10);
    const monthB = parseInt(b.Month, 10);
    return monthA - monthB;
  });

  const marksLabels = sortedMarksData.map((item: any) => {
    const monthIndex = parseInt(item.Month, 10);
    return monthNames[monthIndex];
  });

  const marksData = sortedMarksData.map((item: any) =>
    parseInt(item.average_marks, 10)
  );
  const [selectedOrdersFilter, setSelectedOrdersFilter] = useState<string[]>(
    []
  );

  let batchPayload = {
    agentId: user?.agent_user_id,
    selectedFilters,
    selectedSubject,
    slectedCatId,
  };

  const {
    data: agentBatchOrderList,
    isLoading: agentCostLoading,
    error: agentBatchError,
  } = useGetAgentOrdersListBatchQuery(batchPayload);

  const orderSummary = [
    {
      title: "Total Order",
      value: totalOrders,
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
      value: inProgress,
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
      value: completed,
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

  const newCardDAta = agentBatchOrderList?.result?.batchesData || [];
  const togglePaymentMethod = () => {
    setPaymentMethod(!paymentMethod);
  };

  const makePaymentHandle = () => {
    setMakePayment(!makePayment);
  };
  const toggleSelect = (batchid: number) => {
    setSelectedOrders((prev) =>
      prev.includes(batchid)
        ? prev.filter((i) => i !== batchid)
        : [...prev, batchid]
    );
  };

  const selectOrders = selectedOrders.map((id) =>
    batchesDataUnpaid.find((batch) => batch.batchid === id)
  );
  // const slorder=
  const matchingBatches = batchesDataUnpaid.filter((batch) =>
    selectedOrders.includes(batch.batchid)
  );
  const allOrders = matchingBatches.flatMap((batch) => batch.orders || []);

  const total = allOrders.reduce((sum, order) => {
    const price = Number(order?.balaceamount) || 0;
    return sum + price;
  }, 0);
  console.log("total :", total);
  const amnt = Number(walletAmount?.amount || 0);
  const [withVat, setWithVat] = useState(true);
  const [paymentType, setPaymentType] = useState("full"); // "full" or "partial"
  const [partialAmount, setPartialAmount] = useState("");
  const [partialInput, setPartialInput] = useState("");
  const amountRef = useRef<HTMLInputElement | null>(null);

  // const partialAmount=amountRef.current?.value
  const consumableObj = getConsumableAmounts(
    isChecked ? walletAmount?.amount : 0,
    isChecked ? walletAmount?.rewardsamount : 0,
    paymentType === "full" ? total : partialAmount,
    withVat
  );
  console.log("paymentType :", paymentType);
  const totalWalletConsumableAmount = consumableObj.totalWalletConsumableAmount;
  const cardConsumableAmount = consumableObj.cardConsumableAmount;

  const acutalServiceFee = calculatePaymentFees(cardConsumableAmount);
  const actualVatFee = calculatePaymentVatFees(cardConsumableAmount);

  const discountPercentage = 0;
  const withVatConsumable = getIntOrderConsumableAmnts(
    isChecked ? walletAmount?.amount : 0,
    isChecked ? walletAmount?.rewardsamount : 0,
    total,
    discountPercentage,
    true
  );

  const withoutVatConsumable = getIntOrderConsumableAmnts(
    isChecked ? walletAmount?.amount : 0,
    isChecked ? walletAmount?.rewardsamount : 0,
    total,
    discountPercentage,
    false
  );
  const { serviceChargePercentage, vatFeePercentage } = useSelector(
    (state) => state?.shared
  );
  const [Html, setHtml] = useState();
  const serviceChargeFee = serviceChargePercentage;
  const vatChargeFee = vatFeePercentage;

  const { standardValues } = useGetStandardValuesQuery(user?.agent_user_id);
  const STANDARD_VALUES = standardValues?.result?.[0];
  const [meezanPaymentLink, { isLoading: meezanPaymentLinkLoading }] =
    useMakeMeezanPamentLinkMutation();
  const fourPercent = Number((total * 0.04).toFixed(2));
  const vatPercent = Number((total * 0.2).toFixed(2));
  const allCards = Array.isArray(getAllClientCards) ? getAllClientCards : [];
  const [selectedId, setSelectedId] = useState();

  const [selectedCard, setSelectedCard] = useState(null);
  const [addCard, { isLoading: addCardLoading }] = useAddCardMutation();
  const [isAddWallet, setIsAddWallet] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const elements = useElements();
  const stripe = useStripe();
  const [isLoadinPaying, setIsLoadinPaying] = useState(false);
  const handlePayment = async (onNext) => {
    try {
      const selectedCard = allCards?.find((card) => card?.id === selectedId);
      const stripeToken = selectedCard?.stripekey || allCards?.[0]?.stripekey;
      if (!stripeToken) {
        toast.error("No valid Stripe card token found.");
        // setIsLoading(false);
        return;
      }

      let totalAmount = 0;
      let tableRows = "";
      const orderIds: string[] = [];
      selectOrders[0]?.orders?.forEach((order, index) => {
        orderIds.push(order?.id);
        tableRows += `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${order?.id}</td>
                    <td>${order?.price}</td>
                  </tr>`;
      });

      const tableHTML = `
          <div id="payment-table" class="p-4 bg-white rounded-lg shadow-md mx-auto">
            <table class="min-w-full table-auto border border-gray-200 rounded-md">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Sr No</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Order ID</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${tableRows}
              </tbody>
            </table>
            <p class="mt-4 text-right font-semibold text-gray-800">
              Remaining: ${paymentType == "partial" ? total - partialAmount : 0}
            </p>
          </div>
        `;

      const tableParent = document.getElementById("table-Image");
      tableParent.innerHTML = tableHTML;

      // 2. Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 100));
      const element = document.getElementById("table-Image");
      const canvas = await html2canvas(element);

      // 4. Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob || blob.size < 100) {
        console.error("Blob is empty or invalid — image likely failed.");
        return;
      }

      // 5. Create File and append to FormData

      const file = new File([blob], "order_table.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("screenshot", file);
      formData.append("token", stripeToken);
      formData.append("agent_id", user?.agent_user_id);
      formData.append("currency", getCurrency(user?.currency));
      formData.append("amount", getFormattedPriceWith3(cardConsumableAmount));
      formData.append(
        "serviceCharges",
        getFormattedPriceWith3(acutalServiceFee)
      );
      formData.append("orderid", orderIds.join(","));
      formData.append(
        "rewardamount",
        getFormattedPriceWith3(consumableObj.rewardConsumableAmount)
      );
      formData.append(
        "walletamount",
        getFormattedPriceWith3(consumableObj.walletConsumableAmount)
      );
      formData.append("vat", getFormattedPriceWith3(actualVatFee));
      formData.append(
        "additionalAmount",
        getFormattedPriceWith3(consumableObj.additionalAmount)
      );

      const payload = {
        token: stripeToken,
        agent_id: user?.agent_user_id,
        screenshot: file,
        currency: getCurrency(user?.currency),
        amount: getFormattedPriceWith3(cardConsumableAmount),
        serviceCharges: getFormattedPriceWith3(acutalServiceFee),
        orderid: orderIds.join(","),
        rewardamount: getFormattedPriceWith3(
          consumableObj.rewardConsumableAmount
        ),
        walletamount: getFormattedPriceWith3(
          consumableObj.walletConsumableAmount
        ),
        vat: getFormattedPriceWith3(actualVatFee),
        additionalAmount: getFormattedPriceWith3(
          consumableObj.additionalAmount
        ),
      };
      // console.log("payload :",payload)
      // return
      const { data: respData, error } = await makePaymentForOrders(formData);
      if (respData?.result === "Successfully Paid") {
        toast.success("Payment successful!");
        setIsLoadinPaying(false);
        onNext();
        // navigate("/payment-success", {
        //   state: {
        //     serviceCharges: acutalServiceFee,
        //     totalAmount: getFormattedPriceWith3(totalAmount),
        //     currency: user?.currency,
        //     customerName: user?.agent_name,
        //     customerId: user?.agent_user_id,
        //     cardConsumableAmount,
        //     totalWalletConsumableAmount: consumableObj.totalWalletConsumableAmount,
        //     rewardConsumable: consumableObj.rewardConsumableAmount,
        //     walletConsumable: consumableObj.walletConsumableAmount,
        //     vatAmount: actualVatFee,
        //     isWithVat: withVat,
        //     additionalAmount: getFormattedPriceWith3(consumableObj.additionalAmount),
        //   },
        // });
      } else {
        console.log("respData :", error);
        // toast.error(respData?.result || "Payment failed.");
        // setIsLoadinPaying(false)
      }

      if (error) {
        // setIsLoadinPaying(false)
        toast.error("Something went wrong during payment.");
      }
    } catch (error) {
      // setIsLoadinPaying(false)
      toast.error("Payment failed. Please try again.");
    } finally {
      setSelectedOrders([]);
      setIsLoadinPaying(false);
    }
  };

  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState<"bank" | "gateway">(
    "bank"
  );
  function ChoosePaymentMethod({ onNext }: { onNext: () => void }) {
    // const handleSelect = (method: "bank" | "gateway") => {
    //   setSelectedMethod(method);
    // };
    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setIsChecked(checked);

      // if (checked) {
      //   setAvailableBalance((prev) => prev - total);
      // } else {
      //   setAvailableBalance((prev) => prev + total);
      // }
    };
    const [paymentUrl, setPaymentUrl] = useState("");
    // const [selectedMethod, setSelectedMethod] = useState(null); // "bank" or "gateway"
    const handleSelect = (method) => {
      setSelectedMethod(method);
      // setPaymentType("full"); // Reset on change
      // setPartialAmount("");
    };
    const isOnlyWalletAmountPayment =
      consumableObj?.totalWalletConsumableAmount > 0 &&
      consumableObj?.cardConsumableAmount == 0
        ? true
        : false;
    const handleNext = async () => {
      const value = Number(amountRef.current?.value);
      setPartialAmount(value);

      if (selectedMethod === "gateway") {
        onNext();
      } else {
        const meezanLinkRes = await meezanPaymentLink({
          amount: getFormattedPriceWith3(
            Number(cardConsumableAmount) + Number(serviceChargeFee)
          ),
          currency,
        });

        const link = meezanLinkRes?.data?.link;

        if (link || isOnlyWalletAmountPayment) {
          if (link) {
            window.location.href=link
          } else {
            toast.error("No payment link found.");
          }
        }
      }
    };
    const navigate = useNavigate();
    const location = useLocation();
    // useEffect(() => {
    //   const meezanPaymentProccess = async () => {
    //     const params = new URLSearchParams(location.search);
    //     const status = params.get("status");
    //     const token = params.get("token");

    //     console.log("params", params);
    //     console.log("status", status);
    //     console.log("token", token);

    //     if (status === "Receipt" || status === "Order Success") {
    //       toast.success("Payment successful!");

    //       // ✅ Redirect to success page (change URL as needed)
    //       navigate("/orders");
    //       setStep(3)
    //     } else if (status === "payment_declined") {
    //       toast.error("Payment failed or was declined.");

    //       // Optionally redirect back to step 1 or a retry page
    //       // navigate("/payment/failed");
    //     }
    //   };

    //   meezanPaymentProccess();
    // }, [location.search]);

    return (
      <>
        <div className="grid grid-cols-1 px-12">
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
                    <input
                      checked={isChecked}
                      type="checkbox"
                      className="sr-only peer"
                      onChange={
                        availableBalance > 0 ? handleSwitchChange : () => {}
                      }
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-700 after:border-[#C6BCBC] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600 relative" />
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-green-500 text-sm font-medium">
                  Available:
                </span>
                <span className="text-green-600 font-semibold text-sm">
                  {" "}
                  {currency} {availableBalance}
                </span>
              </div>
            </div>

            {/* Card form */}
            {/* <button
            onClick={() => setIsAddWallet(true)}
            className="w-full h-[48px] rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 transition my-2"
          >
            Add New Card
          </button>
          {isAddWallet && (
            <div className="">
              <div className="mb-2">
                <label className="block mb-1">Card Number</label>
                <CardNumberElement className="border p-3 rounded w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Expiry</label>
                  <CardExpiryElement className="border p-3 rounded w-full" />
                </div>
                <div>
                  <label className="block mb-1">CVC</label>
                  <CardCvcElement className="border p-3 rounded w-full" />
                </div>
              </div>
              <div className="text-center pt-2 pb-5">
                <button
                  onClick={handleAddWalletCard}
                  className="h-[48px] w-[120px] rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
                >
                  Add
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-5">
            {allCards.slice(-1).map((card, index) => (
              <CardItem
                card={card}
                key={card.id || index}
                isSelected={selectedCard?.id === card.id}
                onSelect={setSelectedCard}
              />
            ))}
          </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => handleSelect("bank")}
                className={`cursor-pointer border rounded-2xl p-6 shadow-md transition-all duration-300 ${
                  selectedMethod === "bank"
                    ? "border-[#13A09D] bg-[#E6F8F7]"
                    : "border-gray-300 bg-white hover:border-[#13A09D]"
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">Bank Transfer</h3>
                <div className="flex justify-between items-center">
                  <span>Price :</span>
                  <span>{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Proceesing Fee :</span>
                  <span>04 %</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="line-through">Vat (20%):</span>
                  <span className="line-through">04 %</span>
                </div>
                {isChecked && (
                  <div className="flex text-red-500 justify-between items-center">
                    <span className="">Wallet:</span>
                    <span>
                      -{currency} {availableBalance}
                    </span>
                  </div>
                )}
                <div className="flex justify-end mt-2 items-center">
                  <span className="text-[#12A09D] font-semibold">
                    Total {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Gateway Card */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect("gateway");
                  setWithVat(true);
                }}
                className={`cursor-pointer border rounded-2xl p-6 shadow-md transition-all duration-300 ${
                  selectedMethod === "gateway"
                    ? "border-[#13A09D] bg-[#E6F8F7]"
                    : "border-gray-300 bg-white hover:border-[#13A09D]"
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">Payment Gateway</h3>
                <div className="flex justify-between items-center">
                  <span>Price :</span>
                  <span>{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Proceesing Fee :</span>
                  <span>04 %</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="">Vat (20%):</span>
                  <span>04 %</span>
                </div>
                {isChecked && (
                  <div className="flex text-red-500 justify-between items-center">
                    <span className="">Wallet:</span>
                    <span>
                      -{currency} {availableBalance}
                    </span>
                  </div>
                )}
                <div className="flex justify-end mt-2 items-center">
                  <span className="text-[#12A09D] font-semibold">
                    Total {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            {selectedMethod && (
              <div className="mt-6 px-20">
                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-300 mb-4">
                  <button
                    onClick={() => {
                      if (paymentType !== "full") {
                        setPaymentType("full");
                      }
                    }}
                    className={`pb-2 font-semibold ${
                      paymentType === "full"
                        ? "border-b-2 border-[#13A09D] text-[#13A09D]"
                        : "text-gray-600"
                    }`}
                  >
                    Full Payment
                  </button>
                  <button
                    onClick={() => {
                      if (paymentType !== "partial") {
                        setPaymentType("partial");
                      }
                    }}
                    className={`pb-2 font-semibold ${
                      paymentType === "partial"
                        ? "border-b-2 border-[#13A09D] text-[#13A09D]"
                        : "text-gray-600"
                    }`}
                  >
                    Partial Payment
                  </button>
                </div>

                {/* Content Based on Tab */}
                <div className="mt-4">
                  {paymentType === "partial" && (
                    <div className="py-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Amount
                      </label>
                      <input
                        ref={amountRef}
                        type="number"
                        // min="0"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#13A09D]"
                        placeholder="Enter partial payment amount"
                        // value={partialAmount}
                        // onChange={(e) => {
                        //   setPartialAmount(e.target.value);
                        // }}
                      />
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Payment Summary
                    </h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Price:</span>
                      <span>
                        {currency} {total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Processing Fee (4%) :</span>
                      <span>
                        {currency} {fourPercent}
                      </span>
                    </div>
                    {selectedMethod === "gateway" && paymentType === "full" && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>VAT (20%):</span>
                        <span>
                          {currency}
                          {getFormattedPriceWith3(actualVatFee)}
                        </span>
                      </div>
                    )}
                    {/* {isChecked && (
                    <>
                      {paymentType == "partial" ? (
                        <div className="flex justify-between items-center">
                          <span className="text-red-500">Wallet</span>
                          {partialAmount > availableBalance &&
                          paymentType === "partial" &&(
                            <div className="text-[#12a09d]">
                              <span>Payable Amount</span>{" "}
                              <span>{total - partialAmount}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex text-red-500 justify-between items-center">
                          <span>Wallet:</span>
                          <span>
                            -{currency} {availableBalance}
                          </span>
                        </div>
                      )}
                    </>
                  )} */}

                    <div className="flex justify-between items-center">
                      {paymentType === "full" && (
                        <span className="text-red-500">Wallet</span>
                      )}
                      {total > availableBalance && paymentType === "full" && (
                        <span className="line-through text-red-500">
                          {availableBalance}
                        </span>
                      )}
                    </div>
                    {/* <div className="flex justify-between text-base font-semibold text-[#13A09D] mt-2">
                    <span>Payable Amount:</span>
                    <span>
                      {currency} {total.toFixed(2)}
                    </span>
                  </div> */}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleNext}
                className="bg-teal-600 text-white px-12 rounded-md py-2 outline-none mt-4 hover:bg-teal-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  function OrderSummary({
    onNext,
    onBack,
  }: {
    onNext: () => void;
    onBack: () => void;
  }) {
    const handleAddWalletCard = async () => {
      // if (!stripe || !elements) return;

      const cardElement = elements.getElement(CardNumberElement);
      // if (!cardElement) return;
      const { token, error } = await stripe.createToken(cardElement, {
        name: "Card Holder", // optional
      });
      // return
      if (token) {
        const res = await addCard({
          clientid: user?.agent_user_id,
          cardtype: token?.card?.brand,
          Lastfourdigit: token?.card?.last4,
          Stripekey: token?.id,
        });

        const { data: respData, error } = res;
        if (respData) {
          if (respData?.result?.result == "Card Detail Added Successfully") {
            toast.success("Card Detail Added Successfully");
            return true;
          }
        }
        // toast.success("Wallet Added Successfuly")
        // onClick({
        //   stripeToken: token.id,
        //   cardDetails: token.card,
        // });
        // return
        // setIsAddWallet(false);
      } else if (error) {
        console.error("Stripe Error:", error.message);
      }
      // return
    };
    const CardItem = ({ card, isSelected, onSelect }) => {
      return (
        <div
          onClick={() => onSelect(card)}
          className={`w-full bg-gradient-to-br p-5 rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105
          from-indigo-600 to-purple-600 text-white
          ${isSelected ? "ring-4 ring-yellow-400" : ""}`}
        >
          <div className="flex justify-between items-center mb-6">
            <span className="uppercase tracking-widest text-sm font-semibold">
              Virtual Card
            </span>
            <img
              src={
                card.brand === "Mastercard"
                  ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                  : "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
              }
              alt={card.brand}
              className="h-6"
            />
          </div>

          <div className="text-2xl font-mono tracking-widest mb-4">
            •••• •••• •••• {card.last4}
          </div>

          <div className="flex justify-between items-center text-sm font-medium">
            <div>
              <p className="uppercase text-xs text-gray-200">Card Holder</p>
              <p>{card.cardholder || "Aliyan Hassan"}</p>
            </div>
            <div>
              <p className="uppercase text-xs text-gray-200">Expires</p>
              <p>
                {card.exp_month}/{card.exp_year}
              </p>
            </div>
          </div>
        </div>
      );
    };

    if (isLoadinPaying) {
      return (
        <div className="e-full h-[70vh]">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        </div>
      );
    }
    return (
      <>
        {selectedMethod !== "bank" && (
          <div className="mx-auto bg-white p-6 shadow rounded-xl w-full max-w-md">
            <div className="">
              <div className="mb-2">
                <label className="block mb-1">Card Number</label>
                <CardNumberElement className="border p-3 rounded w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Expiry</label>
                  <CardExpiryElement className="border p-3 rounded w-full" />
                </div>
                <div>
                  <label className="block mb-1">CVC</label>
                  <CardCvcElement className="border p-3 rounded w-full" />
                </div>
              </div>
              <div className="text-center pt-2 pb-5">
                <button
                  onClick={handleAddWalletCard}
                  className="h-[48px] w-[120px] rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 py-5">
              {allCards.map((card, index) => (
                <CardItem
                  card={card}
                  key={card.id || index}
                  isSelected={selectedCard?.id === card.id}
                  onSelect={setSelectedCard}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => handlePayment(onNext)}
                className="bg-teal-600 text-white px-6 py-2 rounded"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {selectedMethod === "bank" && (
          <div className="mx-auto bg-white p-6 shadow rounded-xl w-full max-w-md">
            <h1>Bank</h1>
          </div>
        )}

        <div
          className="mx-auto mt-5 bg-white p-6 shadow rounded-xl w-full"
          id="table-Image"
          style={{ opacity: "-44" }}
        ></div>
      </>
    );
  }

  function PaymentSuccess() {
    const backToOrders = () => {
      setStep(1);
      setMakePayment(false);
      setPaymentMethod(false);
      navigate("/orders");
    };
    return (
      <div className="flex justify-center">
        <div className="flex flex-col w-[300px] items-center justify-center text-center">
          <img src={paymentsuccess} alt="success" className="w-[300px] mb-6" />
          <h2 className="text-2xl font-bold text-teal-700 mb-2">
            Payment Successful
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Your payment was successful. Sit back and relax while we handle the
            rest.
          </p>
          <button
            onClick={backToOrders}
            className="bg-teal-600 w-full text-white px-6 py-2 rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }
  const toggleFilter = (batch: string) => {
    setSelectedFilters((prev) =>
      prev.includes(batch) ? prev.filter((b) => b !== batch) : [...prev, batch]
    );
  };
  const toggleCateg = (category: { id: string; ordercategoryname: string }) => {
    setSelectedCategoryList((prev) => {
      const isSelected = prev.some((c) => c.id === category.id);
      setslectedCatId(cat?.id);
      return isSelected
        ? prev.filter((c) => c.id !== category.id)
        : [...prev, category];
    });
  };

  // const data=agentBatchOrderList?.result
  const handleClickSeeAll = () => {
    setIsOrderedList(!isOrderedList);
  };

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
    setTitle("My Orders");
  }, [setTitle]);

  return (
    <>
      {makePayment || isOrderedList ? (
        <>
          {paymentMethod ? (
            <>
              <div className="max-w-3xl mx-auto py-10 px-4">
                <div className="relative flex justify-between items-center mb-10 px-4">
                  {[
                    "Choose payment Method",
                    "Make Payment",
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
                    onClick={() => {
                      setIsOrderedList(false);
                      setMakePayment(!makePayment);
                    }}
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
                  selectedOrders={selectedOrders}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-12">
                {batchesDataUnpaid.map((order, index) => {
                  const isSelected = selectedOrders.includes(order?.batchid);
                  // console.log("order",order)
                  return (
                    <PaymentCard
                      key={index}
                      order={order}
                      index={index}
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
                      index === 0
                        ? "lg:col-span-12 !px-10 mb-2"
                        : "lg:col-span-6"
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

                    <div className="">
                      <h4 className="mt-2 font-bold text-gray-800 text-2xl">
                        {order.value}
                      </h4>
                      <div className="mt-4">
                        <div className="flex items-center gap-1">
                          {order.badge}
                          <span className={`text-sm`}>
                            {order.trend.percent}{" "}
                            <span className="text-[#606060]">
                              {order.trend.description}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 border-2 bg-white rounded-xl pb-6 shadow">
              {agentCostLoading ? (
                <Loader />
              ) : (
                <BarChartOne title="Orders" labels={labels} dataSet={data} />
              )}
            </div>

            <div className="col-span-12 lg:col-span-4 border-2 bg-white rounded-xl shadow">
              {agentCostLoading ? (
                <Loader />
              ) : (
                <BarChartOne
                  title="Marks"
                  labels={marksLabels}
                  dataSet={marksData}
                />
              )}
            </div>
          </div>

          <div className="mt-12">
            <div className="w-full flex-wrap flex justify-between items-center px-2">
              {/* Left Side: Title + See All */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-black">Order List</h2>
                <button
                  onClick={handleClickSeeAll}
                  className="text-[#13A09D] border-b border-[#13A09D] cursor-pointer"
                >
                  See All
                </button>
              </div>

              {/* Right Side: Buttons + Search */}
              <div className="flex items-center flex-wrap gap-3">
                <button
                  onClick={makePaymentHandle}
                  className="bg-[#157BA7] text-white text-sm px-4 py-1.5 min-w-[96px] max-w-[150px] h-[39px] rounded"
                >
                  Payment
                </button>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 text-sm border-2 border-[#B9AFAF] rounded"
                  />
                  <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md shadow"
                  >
                    <FaFilter /> Filter
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium"></span>
                        <button
                          onClick={() => setSelectedFilters([])}
                          className="text-teal-600 text-sm font-medium"
                        >
                          Clear all
                        </button>
                      </div>

                      {["Paid Orders", "Unpaid Orders", "Partially paid"].map(
                        (filter) => (
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
                            ></span>
                          </div>
                        )
                      )}

                      {/* Dropdown Type Of Papers */}
                      <div className="mb-4">
                        <button
                          onClick={() =>
                            setShowSubjectDropdown(!showSubjectDropdown)
                          }
                          className="flex items-center justify-between w-full text-sm font-medium"
                        >
                          {selectedSubject || "Any University"}{" "}
                          <IoMdArrowDropdown />
                        </button>
                        {showSubjectDropdown && (
                          <div className="border max-h-48 overflow-y-auto rounded p-2 mt-1 space-y-1 bg-white shadow">
                            {subjects.map((subject) => (
                              <div
                                key={subject?.id}
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                onClick={() => {
                                  setSelectedSubject(subject?.id);
                                  setShowSubjectDropdown(false);
                                }}
                              >
                                {subject?.value}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Dropdown Academic_level */}
                      <div className="mb-4">
                        <button
                          onClick={() =>
                            setShowAcademicLevel(!showAcademicLevel)
                          }
                          className="flex items-center justify-between w-full text-sm font-medium"
                        >
                          {selectedAcademicLevel || "Academic Level"}{" "}
                          <IoMdArrowDropdown />
                        </button>
                        {showAcademicLevel && (
                          <div className="border max-h-48 overflow-y-auto rounded p-2 mt-1 space-y-1 bg-white shadow">
                            {academicLevels.map((subject) => (
                              <div
                                key={subject?.id}
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                onClick={() => {
                                  setSelectedAcademicLevel(subject?.id);
                                  setShowAcademicLevel(false);
                                }}
                              >
                                {subject?.value}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dropdown Category */}

                      <div className="mb-4 relative">
                        <button
                          onClick={() => setShowCategory(!showCategory)}
                          className="flex items-center justify-between w-full border rounded p-2 text-sm font-medium"
                        >
                          {selectedCategory?.ordercategoryname ||
                            "Select Category"}
                          <IoMdArrowDropdown className="ml-2" />
                        </button>

                        {showCategory && (
                          <div className="absolute z-10 w-full border max-h-48 overflow-y-auto rounded p-2 mt-1 space-y-1 bg-white shadow">
                            {categories.map((cat, index) => (
                              <div
                                key={`${cat.id}-${index}`}
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                onClick={() => {
                                  setSelectedCategory(cat);
                                  setShowCategory(false);
                                  // setShowUniversityDropdown(false); // if you want to close another dropdown
                                }}
                              >
                                {cat?.ordercategoryname}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-8">
            {agentCostLoading ? (
              <div className="w-full col-span-12">
                <Loader />
              </div>
            ) : (
              newCardDAta.map((card, idx) => (
                <OrderCard key={idx} card={card} />
              ))
            )}
          </div>
        </>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
