// utils/api.ts or anywhere appropriate
import axios from "axios";

export const getWalletAmountAgent = async (agentId: string, currency: string) => {
  const formData = new FormData();
  formData.append("agent_id", agentId);
  formData.append("currency", currency);

  const response = await axios.post("https://staging.portalteam.org/get_wallet_amount_agent", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // assuming it returns { amount: number }
};
