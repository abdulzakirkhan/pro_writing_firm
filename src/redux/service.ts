
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const api = createApi({
  reducerPath: 'api', // Unique key to identify the API slice in the store
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'CostData',
    'InternetReconnectivity',
    'Profile',
    'Chat',
    'WalletCards',
    'WalletAmount',
    'AgentBatchOrders',
    'AgentBatchOrdersUnPaid',
    'Agentnotification',
    'creditLimitAgent',
    'AgentCostData',
    'AgentCurrentMonthCost',
    'AgentOrdersData',
    'InternetReconnectivity',
    'GetAllAgentClients',
    'AgentOrderInititateClients',
    'AgentPendingOrdersList',
    "PaymentCards",
  ],
  endpoints: (builder) => ({}), // Define your endpoints here
});
