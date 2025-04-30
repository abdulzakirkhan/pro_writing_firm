import { api } from "../service";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCards: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append("clientid", clientId);
        return {
          url: `/getclientcarddetailof_agent`,
          method: "POST",
          body: formData,
        };
      },
      providesTags: ["PaymentCards"],
    }),
    addCard: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append("clientid", body?.clientid);
        formData.append("cardtype", body?.cardtype);
        formData.append("fourdigit", body?.Lastfourdigit);
        formData.append("stripekey", body?.Stripekey);
        return {
          url: `/addclientcarddetail_agent`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["PaymentCards"],
    }),

    getpaymentHistry: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append("clientid", clientId);
        return {
          url: `/transactionhistory_agent`,
          method: "POST",
          body: formData,
        };
      },
      providesTags: ["PaymentCards"],
    }),
    makePaymentForOrders: builder.mutation({
      query: (body) => {
        return {
          url: `/paymentwithwalletconsume_agent`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['PaymentCards', 'PaymentCards', 'WalletAmount', "AgentBatchOrders",
      "AgentBatchOrdersUnPaid","creditLimitAgent"],
    }),
    addWalletCard: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append("clientid", body?.clientid);
        formData.append("cardtype", body?.cardtype);
        formData.append("lastfourdigit", body?.Lastfourdigit);
        formData.append("stripekey", body?.Stripekey);
        return {
          url: `/addwalletcarddetails_agent`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["WalletCards","PaymentCards"],
    }),

    getWalletAllCards: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append("clientid", clientId);
        return {
          url: `/getclientcarddetailofwallets`,
          method: "POST",
          body: formData,
        };
      },
      providesTags: ["WalletCards","PaymentCards"],
    }),
    getWalletAmount: builder.query({
      query: ({ clientId, currency }) => {
        const formData = new FormData();
        formData.append("agent_id", clientId);
        formData.append("currency", currency);
        return {
          url: `/get_wallet_amount_agent`,
          method: "POST",
          body: formData,
        };
      },
      
      providesTags: ["WalletAmount","PaymentCards"],
    }),

    makeWalletPayment: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append("token", body.token);
        formData.append("currency", body.currency);
        formData.append("amount", body.amount);
        formData.append("clientid", body.userId);
        formData.append("viafrom", body.viafrom);
        return {
          url: `/addtowalletpayment_agent`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [
        "WalletCards",
        "WalletAmount",
        "AgentOrdersData",
        "WalletAmount",
        "PaymentCards",
      ],
    }),

    initateOrderPayment: builder.mutation({
      query: (body) => {
        let endpoint;
        if (body?._parts.find((part) => part[0] === "meeting_date")?.[1]) {
          endpoint = "initaiteorderfromappforonlineclassmeetings";
        } else if (
          body?._parts.find((part) => part[0] === "createdByBot")?.[1]
        ) {
          endpoint = "initaiteorderfromappviachatbot";
        } else endpoint = "initaiteorderfromapp";
        return {
          url: `/admin/${endpoint}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [
        "PaymentCards",
        "PaymentCards",
        "UserCurrencyAndCountry",
        "Orders",
        "WalletAmount",
        "Rewards","PaymentCards"
      ],
    }),


    tipToWriterPayemnt: builder.mutation({
      query: (body) => {
        return {
          url: `/admin/tiptowriter`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [
        "Payment",
        "PaymentCards",
        "WalletAmount",
        "Rewards",
        "Orders",
      ],
    }),
    makeMeezanPamentLink: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append("amount", body.amount);
        formData.append("currency", body.currency);
        return {
          url: "/generatemeezanlink_agent_app",
          method: "POST",
          body: formData,
        };
      },
    }),
    makeMeezanPayment: builder.mutation({
      query: (body) => {
        return {
          url: `/meezanbankapibulkpaymentwithconsume_agent`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [
        "Payment",
        "PaymentCards",
        "WalletAmount",
        "AgentBatchOrders",
        "AgentBatchOrdersUnPaid",
        "creditLimitAgent",
      ],
    }),
    getAddOnsPrices: builder.query({
      query: () => {
        return {
          url: `/admin/add_ons_for_app_fetch`,
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useGetAllCardsQuery,
  useAddCardMutation,
  useGetpaymentHistryQuery,
  useMakePaymentForOrdersMutation,
  useAddWalletCardMutation,
  useGetWalletAllCardsQuery,
  useGetWalletAmountQuery,
  useMakeWalletPaymentMutation,
  useInitateOrderPaymentMutation,
  useTipToWriterPayemntMutation,
  useMakeMeezanPamentLinkMutation,
  useMakeMeezanPaymentMutation,
  useGetAddOnsPricesQuery,
} = paymentApi;
