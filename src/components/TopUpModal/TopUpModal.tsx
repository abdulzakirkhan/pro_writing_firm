import { useState } from "react";
import ICON from "../../../icons/payment.png";
import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast, { Toaster } from "react-hot-toast";
import { useGetAllCardsQuery, useGetWalletAmountQuery } from "../../redux/paymentApi/paymentApi";
import { useSelector } from "react-redux";
import { getCurrency } from "../../config/indext";

const amounts = [100, 200, 500, 1000];
type TopUpModalProps = {
  onCancel: () => void;
  onClick: (formData: { card: string; cvc: string; expiry: string }) => void;
};
const TopUpModal = ({ onCancel, onClick ,handlePayment }: TopUpModalProps) => {
  const user = useSelector((state) => state.auth?.user);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [isAddWallet, setIsAddWallet] = useState(false);
  const elements = useElements();
  const [form, setForm] = useState({
    card: "",
    cvc: "",
    expiry: "",
  });
  const {data: getAllCards = { result: { result: {} } },isLoading: allCardsLoading,refetch: getAllCardsRefech,} = useGetAllCardsQuery(user?.userid);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const stripe = useStripe();
  const handleAddWalletCard = async () => {
    // console.log("object")
    // if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    // if (!cardElement) return;
    // console.log("object")
    const { token, error } = await stripe.createToken(cardElement, {
      name: "Card Holder", // optional
    });
    console.log("token",token)
    // return
    if (token) {
      // console.log("object")
      // toast.success("Wallet Added Successfuly")
      onClick({
        stripeToken: token.id,
        cardDetails: token.card,
      });
      // return
      setIsAddWallet(false);
    } else if (error) {
      console.error("Stripe Error:", error.message);
    }
    // return
  };
  const allCards = Array.isArray(getAllCards) ? getAllCards : [];

  console.log("allCards",allCards)
  const [selectedCard, setSelectedCard] = useState(null);

  const CardItem = ({ card , isSelected, onSelect}) => {
    return (
      <div onClick={() => onSelect(card)}
      className={`w-full bg-gradient-to-br p-5 rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105
        from-indigo-600 to-purple-600 text-white
        ${isSelected ? "ring-4 ring-yellow-400" : ""}`}>
      <div className="flex justify-between items-center mb-6">
        <span className="uppercase tracking-widest text-sm font-semibold">Virtual Card</span>
        <img
          src={card.brand === "Mastercard"
            ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
            : "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"}
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
          <p>{card.exp_month}/{card.exp_year}</p>
        </div>
      </div>
    </div>
    );
  };
  
  const handleClick= (selectCard) =>{
    // console.log("clicked",selectCard)
    handlePayment({card:selectCard,amount:selectedAmount})
  }

  return (
    <>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white w-[700px] max-w-full p-6 rounded-2xl shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">
          Top-up Wallet
        </h2>

        <p className="text-[#6D6D6D] text-md mb-2">Choose an amount:</p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setSelectedAmount(amt)}
              className={`border rounded-lg py-2 font-semibold ${
                selectedAmount === amt
                  ? "bg-[#13A09D] text-white"
                  : "border-[#13A09D] text-[#13A09D]"
              }`}
            >
              $ {amt.toLocaleString()}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={`$ ${selectedAmount.toLocaleString()}`}
          readOnly
          className="border w-full mb-4 px-3 py-3 text-gray-700"
        />

        <button
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
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-5">
          {allCards.slice(0, 12).map((card, index) => (
            <CardItem
              card={card}
              key={card.id || index}
              isSelected={selectedCard?.id === card.id}
              onSelect={setSelectedCard}
            />
          ))}
            </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="w-[200px] h-[48px] rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() =>handleClick(selectedCard)}
            className="w-[200px] h-[48px] rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
    <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default TopUpModal;
