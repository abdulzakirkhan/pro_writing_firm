import { store } from "../redux/store";

const getConsumableAmounts = (
  walletAmount = 0,
  rewardAmount = 0,
  orderAmount = 0
) => {
  let walletConsumableAmount = 0;
  let rewardConsumableAmount = 0;
  let totalWalletConsumableAmount = 0;
  let cardConsumableAmount = 0;
  let additionalAmount = 0;

  let minimumCardAmount = store?.getState()?.shared?.minimumCardAmount ?? 0.6;

  // First, consume from rewards (high priority)
  rewardConsumableAmount = Math.min(rewardAmount, orderAmount);
  orderAmount -= rewardConsumableAmount;

  // If order amount is still remaining, consume from wallet
  if (orderAmount > 0) {
    walletConsumableAmount = Math.min(walletAmount, orderAmount);
    orderAmount -= walletConsumableAmount;
  }

  // Calculate total wallet consumable amount
  totalWalletConsumableAmount = rewardConsumableAmount + walletConsumableAmount;

  // Handle card consumable amount
  if (orderAmount > 0) {
    cardConsumableAmount = orderAmount;
  }

  // Ensure cardConsumableAmount meets minimumCardAmount
  if (cardConsumableAmount > 0 && cardConsumableAmount < minimumCardAmount) {
    additionalAmount = minimumCardAmount - cardConsumableAmount;
    cardConsumableAmount = minimumCardAmount;
  }

  return {
    walletConsumableAmount: Number(walletConsumableAmount) ?? 0,
    rewardConsumableAmount: Number(rewardConsumableAmount) ?? 0,
    totalWalletConsumableAmount: Number(totalWalletConsumableAmount) ?? 0,
    cardConsumableAmount: Number(cardConsumableAmount) ?? 0,
    additionalAmount: Number(additionalAmount) ?? 0, // New property
  };
};



const calculatePaymentFees = (paymentAmount: number) => {
  const storeValues = store?.getState();
  const fee = Number(storeValues?.shared?.serviceChargePercentage);
  return (fee * paymentAmount) / 100;
};

const calculatePaymentVatFees = (paymentAmount) => {
  const storeValues = store?.getState();

  const fee = Number(storeValues?.shared?.vatFeePercentage);
  return (fee * paymentAmount) / 100;
};
const getFormattedPriceWith3 = (price) => {
  if (price) {
    const truncatedAmount = Math.trunc(price * 100) / 100;
    return truncatedAmount.toFixed(3);
  } else return '0.00';
};
export { getConsumableAmounts, calculatePaymentFees, calculatePaymentVatFees,getFormattedPriceWith3 };
