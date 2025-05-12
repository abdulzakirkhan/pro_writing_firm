import { DateTime } from 'luxon';
import { api } from '../service';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderByPaymentType: builder.query({
      query: (body) => {
        return {
          url: `/admin/getOrdersstatuswise`,
          method: 'POST',
          body,
        };
      },
      providesTags: ['Payment'],
    }),
    initiateOrder: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('clientid', body.userId);
        formData.append('price', body.price);
        formData.append('currency', body.currency);
        formData.append('academiclevel', body.academicLevel);
        formData.append('typeofpaper', body.typeOfPaper);
        formData.append(
          'deadline',
          DateTime.fromISO(body.deadline).toISODate()
        );
        formData.append('country', body.country);
        formData.append('noofwords', body.noOfWords);
        formData.append('universityname', body.universityName);
        formData.append('descri', body.description);
        return {
          url: `/admin/clientorderinitiateapi`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Orders', 'InitiatedOrders', 'UserCurrencyAndCountry'],
    }),
    getInitiatedOrders: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          url: `/admin/getclientorderinitaitedetail`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['Payment', 'InitiatedOrders'],
    }),
    updateMarks: builder.mutation({
      query: (body) => {
        return {
          url: `/admin/marksupdatebyclient`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Payment'],
    }),
    getAllBanner: builder.query({
      query: () => {
        return {
          url: `/admin/chatappbanners`,
          method: 'POST',
        };
      },
    }),
    getAllOrderCatagery: builder.query({
      query: () => {
        return {
          url: `/admin/ordercategory`,
          method: 'POST',
        };
      },
    }),
    getOrderPricesForTerrif: builder.query({
      query: (userId) => {
        const formData = new FormData();
        formData.append('user_id', userId);
        return {
          url: `/admin/sendorderpricefororderinitiate`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    getUserCurrencyAndCountry: builder.query({
      query: (body) => {
        return {
          url: `/admin/getcurre`,
          method: 'POST',
          body,
        };
      },
      providesTags: ['UserCurrencyAndCountry'],
    }),
    getAllItSubject: builder.query({
      query: () => {
        return {
          url: `/admin/get_Average_papersubject_words`,
          method: 'POST',
        };
      },
    }),
    notifyServer: builder.mutation({
      query: (body) => {
        return {
          url: `/admin/notify_server`,
          method: 'POST',
          body,
        };
      },
    }),
    getNotificationDetais: builder.query({
      query: (body) => {
        return {
          url: `/admin/get_notify_detail_on_server`,
          method: 'POST',
          body,
        };
      },
    }),
    getDesclaimer: builder.query({
      query: () => {
        return {
          url: `/admin/running`,
          method: 'POST',
        };
      },
    }),
    addBannerInterest: builder.mutation({
      query: (body) => {
        return {
          url: `/admin/addbannerinteresteddata`,
          method: 'POST',
          body,
        };
      },
    }),
    addFileDownloaded: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('userid', body.userid);
        formData.append('orderid', body.orderid);
        return {
          url: `/admin/final_file_downloaded`,
          method: 'POST',
          body:formData,
        };
      },
    }),
    agentInitiateOrder: builder.mutation({
      query: (body) => {
        return {
          url: `/agent_initiate_order`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['WalletAmount', "AgentBatchOrders",
        "AgentBatchOrdersUnPaid","creditLimitAgent",'AgentCostData',
        'AgentCurrentMonthCost',
        'AgentOrdersData'
      ],
    }),









    uploadFileForFileReader: builder.mutation({
      query: (body) => {
        return {
          url: `/upload_file_get_url`,
          method: 'POST',
          body,
        };
      },
      
    }),

    uploadFileLinkForFileReader: builder.mutation({
      query: (body) => {
        return {
          // url: `http://192.168.100.67:8000/extract`,
          url: `http://20.196.31.116:8001/extract`,
          method: 'POST',
          body,
        };
      },
    })
  }),
});

export const {
  useGetOrderByPaymentTypeQuery,
  useInitiateOrderMutation,
  useGetInitiatedOrdersQuery,
  useUpdateMarksMutation,
  useGetAllBannerQuery,
  useGetAllOrderCatageryQuery,
  useGetOrderPricesForTerrifQuery,
  useGetUserCurrencyAndCountryQuery,
  useGetAllItSubjectQuery,
  useNotifyServerMutation,
  useGetNotificationDetaisQuery,
  useGetDesclaimerQuery,
  useAddBannerInterestMutation,
  useAddFileDownloadedMutation,
  useAgentInitiateOrderMutation,
  useUploadFileForFileReaderMutation,
  useUploadFileLinkForFileReaderMutation,
} = ordersApi;
