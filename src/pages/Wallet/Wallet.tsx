import { useEffect, useState } from "react";
import { useTitle } from "../../context/TitleContext";
import TopUpModal from "../../components/TopUpModal/TopUpModal";
import {
  useAddWalletCardMutation,
  useGetAllCardsQuery,
  useGetpaymentHistryQuery,
  useGetWalletAmountQuery,
  useGetWalletHistoryQuery,
  useMakeWalletPaymentMutation,
} from "../../redux/paymentApi/paymentApi";
import { useSelector } from "react-redux";
import { getCurrency } from "../../config/indext";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/Loader/Loader";

export default function Wallet() {
  const { setTitle } = useTitle();
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.auth?.user);
  const {
    data,
    error,
    isLoading: walletHistoryLoading,
  } = useGetWalletHistoryQuery({
    agent_id: user?.agent_user_id,
  });
  const {
    data: getAllCards = { result: { result: {} } },
    isLoading: allCardsLoading,
    refetch: getAllCardsRefech,
  } = useGetAllCardsQuery(user?.agent_user_id);
  const allCards = Array.isArray(getAllCards) ? getAllCards : [];
  const {
    data: walletAmount,
    isLoading: walletAmountLoading,
    refetch: walletAmountRefech,
  } = useGetWalletAmountQuery({
    clientId: user?.agent_user_id,
    currency: getCurrency(user?.currency),
  });
  const {
    data: paymentHistory,
    isLoading: paymentHistoryLoading,
    refetch: paymentHistoryRefech,
  } = useGetpaymentHistryQuery(user?.agent_user_id);
  const [addCard, { isLoading: addCardLoading }] = useAddWalletCardMutation();
  const [makePayment, { isLoading: makePaymentLoading }] =
    useMakeWalletPaymentMutation();
  const [selectedId, setSelectedId] = useState();

  const handleAddCard = async (formData) => {
    // console.log("formData :" , formData?.stripeToken)
    // return
    console.log("Card :", formData);
    const res = await addCard({
      clientid: user?.agent_user_id,
      cardtype: formData?.cardDetails?.brand,
      Lastfourdigit: formData?.cardDetails?.last4,
      Stripekey: formData?.stripeToken,
    });

    const { data: respData, error } = res;
    if (respData) {
      if (respData?.result == "Client Card Detail Added Successfully") {
        toast.success("Client Card Detail Added Successfully'");
        return true;
      } else {
        console.log("error");
      }
    }

    if (error) {
      console.log("object");
    }
    toast.error("Error");

    return false;
  };

  const PAYMENT_ERROR = "Stripe API Error: Your card was declined.";
  const handlePayment = async ({ card, amount }) => {
    // console.log("object",card)
    // console.log("amount",amount)
    setSelectedId(card?.id);
    // return
    try {
      const selectedCard = allCards?.find((card) => card?.id == selectedId);
      // console.log("selectedCard :",selectedCard)
      // return
      const payload = {
        currency: getCurrency(user?.currency),
        amount: amount,
        userId: user?.agent_user_id,
        token: card?.stripekey,
        viafrom: "stripe",
      };

      // return
      const res = await makePayment(payload);

      const { data: respData, error } = res || {};
      if (respData) {
        if (respData?.result == "Successfully Added Into Wallet") {
          console.log("Payment successful");
          toast.success("To up Successfull !");
          setShowModal(false);
        } else if (respData?.result == PAYMENT_ERROR) {
          toast.error(respData?.result);
          setShowModal(false);
        } else toast.error(respData?.result);
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went wrong");
    }
  };
  // console.log("walletAmount", walletAmount)
  const Modal = ({ onCancel }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Only dim the background without blur */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white flex flex-col justify-center lg:w-[925px] h-[255px] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-teal-700 mb-3">
          Top-up Wallet
        </h2>
        <p className="text-[#6D6D6D] text-[20px]">Choose an amount:</p>

        <div className="">
          <div className="flex items-center gap-4">
            <button className="w-[195px]">$ 100</button>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="w-[206px] h-[48px] rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
          >
            Cancel
          </button>
          <button
            // onClick={onConfirm}
            className="w-[206px] h-[48px] rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
  const oldHistory = data?.data || [];

  const availableWallet = walletAmount?.amount || 0;
  const currency = walletAmount?.currency || 0;

  useEffect(() => {
    setTitle("Wallet");
  }, [setTitle]);

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 justify-between gap-6 items-center">
          <div className="w-full lg:col-span-9 h-[93px] flex items-center bg-white p-4 rounded-xl shadow-md">
            <div className="text-gray-700 text-lg w-full !flex !justify-between items-center font-medium">
              <span>Available Credit:</span>{" "}
              <span className="text-green-600 font-bold">
                {currency} {availableWallet.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="w-full lg:col-span-3">
            <button
              onClick={() => setShowModal(!showModal)}
              className="bg-[#6da5f9] h-[93px] w-full text-white flex justify-center items-center p-4 rounded-lg font-semibold"
            >
              Top-up Wallet
            </button>
          </div>
        </div>

        {/* Table */}
        {paymentHistoryLoading ? (
          <div className="mt-32">
            {" "}
            <Loader />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              History
            </h3>
            <div className="overflow-x-auto h-[452px]">
              <table className="text-sm text-left border-collapse">
                <thead className="text-[#6da5f9] border-b">
                  <tr>
                    <th className="py-2 min-w-[70px]">Sr. No</th>
                    <th className="py-2 min-w-[240px]">Payment Method</th>
                    <th className="py-2 w-[350px]">Description</th>
                    <th className="py-2 min-w-[160px]">Date</th>
                    <th className="py-2 min-w-[120px]">Time</th>
                    <th className="py-2 min-w-[90px]">Amount</th>
                    <th className="py-2 min-w-[130px]">Service Charges</th>
                    <th className="py-2 min-w-[200px]">Credited Amount</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {walletHistoryLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        <Loader />
                      </td>
                    </tr>
                  ) : oldHistory.length > 0 ? (
                    oldHistory.map((entry, index) => {
                      const time = entry?.addedts?.split(" ")[1] || "";
                      return (
                        <tr
                          key={entry.id}
                          className="border-b last:border-none"
                        >
                          <td className="py-2">{index + 1}.</td>
                          <td className="py-2">
                            {`${"*".repeat(
                              entry?.transactionkey?.length - 1
                            )}${entry?.transactionkey?.slice(-1)}`}
                          </td>
                          <td className="py-2">
                            {entry?.Decription}
                          </td>
                          <td className="py-2 ps-1">{entry?.addedts}</td>
                          <td className="py-2">{time}</td>
                          <td className="py-2 font-bold text-xs">
                            {entry?.currency}{" "}
                            {Number(entry?.amount) +
                              Number(entry?.servicecharges)}
                          </td>
                          <td className="py-2 font-bold text-xs">
                            {entry?.currency} {entry?.servicecharges}
                          </td>
                          <td className="py-2 font-bold text-x">
                            {entry?.currency} {Math.max(0, Number(entry?.amount))}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center text-gray-500 py-4"
                      >
                        No Top-up history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <TopUpModal
          onCancel={() => setShowModal(false)}
          onClick={handleAddCard}
          handlePayment={handlePayment}
        />
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
