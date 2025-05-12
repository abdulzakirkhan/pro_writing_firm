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

const getLast12Months=()=> {
  const monthsYears = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
      // Create a new date object for the month i months ago
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i);
      
      // Push the month and year into the array
      monthsYears.push({
          month: date.getMonth() + 1, // getMonth() returns 0-11, so we add 1
          year: date.getFullYear()
      });
  }

  return monthsYears;
}


const getColor = (isLightColor, param) => {
  let color;

  // Map the param to a base hue (range of 0 to 360 degrees for HSL)
  const baseHue = getBaseHue(param);

  // Generate a distinct HSL color for the given param
  let hue = baseHue;
  let saturation = 70 + (param % 30); // Vary saturation slightly for interest
  let lightness = 50 + ((param * 10) % 20); // Vary lightness slightly

  // Adjust lightness to make sure it's light or dark based on the `isLightColor` flag
  if (isLightColor) {
    lightness = Math.min(90, lightness + 20); // Increase lightness for light colors
  } else {
    lightness = Math.max(30, lightness - 20); // Decrease lightness for dark colors
  }

  // Convert HSL to HEX color
  color = hslToHex(hue, saturation, lightness);

  return color;

  function getBaseHue(param) {
    // Assign distinct color families (hues) for different `param` values
    if (param === 1) return 0; // Red
    if (param === 2) return 240; // Blue
    if (param === 3) return 120; // Green
    if (param === 4) return 60; // Yellow
    return (param * 60) % 360; // For larger values, continue cycling through hues
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    const rgb = [r + m, g + m, b + m];
    return (
      '#' +
      rgb
        .map((x) =>
          Math.round(x * 255)
            .toString(16)
            .padStart(2, '0')
        )
        .join('')
    );
  }
};

const getIntOrderConsumableAmnts = (
  walletAmount = 0,
  rewardAmount = 0,
  orderAmount = 0,
  discountPercent = 0, // Discount percentage based on initial order amount
  isWithVat = false
) => {
 
  const storeValues = store?.getState();
  const minimumCardAmount = Number(
    storeValues?.shared?.minimumCardAmount ?? 0.6
  );
  const SERVICE_FEE_PERCENT = Number(
    storeValues?.shared?.serviceChargePercentage ?? 4
  );
  const VAT_PERCENT = Number(
    isWithVat ? storeValues?.shared?.vatFeePercentage ?? 20 : 0
  );

  let walletConsumableAmount = 0;
  let rewardConsumableAmount = 0;
  let totalWalletConsumableAmount = 0;
  let cardConsumableAmount = 0;
  let finalDiscountAmount = 0;
  let actualServiceFee = 0;
  let actualVatFee = 0;
  let additionalAmount = 0;
  

  
  // Apply discount directly to the order amount
  finalDiscountAmount = (discountPercent / 100) * orderAmount;
  orderAmount -= finalDiscountAmount;

  // First, consume from rewards (high priority)
  rewardConsumableAmount = Math.min(rewardAmount, orderAmount);
  orderAmount -= rewardConsumableAmount;

  // If order amount is still remaining, consume from wallet
  if (orderAmount > 0) {
    walletConsumableAmount = Math.min(walletAmount, orderAmount);
    orderAmount -= walletConsumableAmount;
  }

  // Calculate total wallet consumable amount before card fees
  totalWalletConsumableAmount = rewardConsumableAmount + walletConsumableAmount;

  // Check if there is any remaining amount that needs to be covered by card
  if (orderAmount > 0) {
    cardConsumableAmount = orderAmount;

    // Ensure card amount meets the minimumCardAmount
    if (minimumCardAmount > 0 && cardConsumableAmount < minimumCardAmount) {
      additionalAmount = minimumCardAmount - cardConsumableAmount;
      cardConsumableAmount = minimumCardAmount;
    }

    // Recalculate service fee and VAT based on the adjusted card amount
    actualServiceFee = (SERVICE_FEE_PERCENT / 100) * cardConsumableAmount;
    actualVatFee = (VAT_PERCENT / 100) * cardConsumableAmount;

    // Add service fee and VAT to card amount
    cardConsumableAmount += actualServiceFee + actualVatFee;
  } else {
    // Recalculate total wallet consumable amount if no card amount is used
    totalWalletConsumableAmount =
      walletConsumableAmount + rewardConsumableAmount;
  }

  return {
    walletConsumableAmount: Number(walletConsumableAmount) ?? 0,
    rewardConsumableAmount: Number(rewardConsumableAmount) ?? 0,
    totalWalletConsumableAmount: Number(totalWalletConsumableAmount) ?? 0,
    cardConsumableAmount: Number(cardConsumableAmount) ?? 0,
    finalDiscountAmount: Number(finalDiscountAmount) ?? 0,
    actualServiceFee: Number(actualServiceFee) ?? 0,
    actualVatFee: Number(actualVatFee) ?? 0,
    additionalAmount: Number(additionalAmount) ?? 0,
  };
};
export { getConsumableAmounts, getIntOrderConsumableAmnts,calculatePaymentFees, calculatePaymentVatFees,getFormattedPriceWith3,getLast12Months ,getColor};
