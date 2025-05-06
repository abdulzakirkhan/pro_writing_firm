// src/redux/agentApi.ts
import { api } from '../service';
// src/types/agentApiTypes.ts

export interface AgentDashboardInput {
  agentId: any;
  university: any;
  batch: any;
  startDate: any;
  endDate: any;
}

// export interface AgentOrdersInput {
//   agentId: string;
//   university: string;
//   batch: string;
//   paperSubject: string;
// }

// export interface OrderFilterInput {
//   agentId: string;
//   selectedFilterOrder: string;
//   selectedTypePaper: string;
//   selectedCategory: string;
// }

// export interface DeleteOrderInput {
//   orderId: string;
//   agentId: string;
// }
export interface PerformanceInput {
  agentId: any;
  university:string[],
  batch: string[];
  startDate: any,
  endDate: any;  
}


export const agentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgentCostData: builder.query<any, AgentDashboardInput>({
      query: (data) => {
        const formData = new FormData();
        formData.append('agent_id', data.agentId);
        formData.append('university', data.university);
        formData.append('batch', data.batch);
        formData.append('start_date', data.startDate);
        formData.append('end_date', data.endDate);
        return {
          url: `/get_Agent_dashboard_data`,
          method: 'POST',
          body:formData
        };
      },
      providesTags: ['AgentCostData'],
    }),

    getUniversityAndBatches: builder.query({
      query: () => {
        return {
          url: `/get_Batch_and_university_data`,
          method: 'POST',
        };
      },
    }),

    getCurrentMonthCost: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('agent_id', id);
        return {
          url: `/get_Sum_of_current_month_cost`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['AgentCurrentMonthCost'],
    }),


    getPerformanceData: builder.query<any,PerformanceInput>({
      query: (data) => {
        const formData = new FormData();
        formData.append('agent_id', data.agentId);
        formData.append('university', data.university);
        formData.append('batch', data.batch);
        formData.append('start_date', data.startDate);
        formData.append('end_date', data.endDate);
        return {
          url: `/get_data_dashboard_for_marks`,
          method: 'POST',
          body: formData,
        };
      },
    }),


    getAgentCreditLimits: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('agency_id', id);
        return {
          url: `/get_Credit_limit_data`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['creditLimitAgent'],
    }),

    getAgentOrdersData: builder.query({
      query: (data) => {
        const formData = new FormData();
        formData.append('agent_id', data.agentId);
        formData.append('university', data.university);
        formData.append('batch', data.batch);
        formData.append('paper_subject', data.paper_subject);
        //  formData.append('app', appNameCode)
        return {
          url: `/get_Data_of_batch_wise_orders_and_graph`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['AgentOrdersData'],
    }),


    getPaperSubject: builder.query({
      query: () => {
        return {
          url: `/get_Paper_subject_data`,
          method: 'POST',
        };
      },
    }),

    getTypeOfPaper: builder.query({
      query: () => {
        return {
          url: `/get_typeofpaper_Category_academiclevel`,
          method: 'POST',
        };
      },
    }),


    getAgentOrdersListBatch: builder.query({
      query: (data) => {
        const formData = new FormData();
        formData.append('agent_id', data.agentId);
        formData.append('payment_status', data.selectedFilters);
        formData.append('type_of_paper', data.selectedSubject);
        formData.append('categoty', data.selectedCategoryList);
        return {
          url: `/get_batch_wise_order_list`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['AgentBatchOrders'],
    }),

    getOrderDetailsByIds: builder.mutation({
      query: (body) => {
        return {
          url: `/get_data_against_orders_array`,
          method: 'POST',
          body,
        };
      },
    }),
    getAgentAllClients: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('agent_id', id);
        return {
          url: `/get_client_against_agency`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['GetAllAgentClients'],
    }),


    getAllClientsForOrder: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('agent_id', id);
        // console.log("id",id)
        return {
          url: `/get_agent_clients`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['AgentOrderInititateClients'],
    }),

    getAgentOrdersDataMarks: builder.query({
      query: (data) => {
        const formData = new FormData();
        formData.append('agent_id', data.agentId);
        formData.append('university', data.university);
        formData.append('batch', data.batch);
        formData.append('paper_subject', data.paperSubject);
        //  formData.append('app', appNameCode)
        return {
          url: `/get_Data_of_average_marks_graph_annualy`,
          method: 'POST',
          body: formData,
        };
      },
    }),



    getAgentClientOrdersPieChart: builder.query({
      query: (data) => {
        const formData = new FormData();
        formData.append('agent_id', data.agentId);
        formData.append('paper_subject', data.paper_subject);
        formData.append('batch', data.batch);
        return {
          url: `/pie_chart_graph_data_subject_wise_agent`,
          method: 'POST',
          body: formData,
        };
      },
    }),






    getAgentClientOrders: builder.query({
      query: (data) => {
        const formData = new FormData();
        formData.append('clientid', data.agentId);
        formData.append('payment_status', data.selectedFilterOrder);
        return {
          url: `/get_individulas_client_wise_orders_data`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    getAgentPaymentHistory: builder.query({
      query: (data) => {
        const formData = new FormData();
        formData.append('clientid', data.agentId);
        return {
          url: `/transactionhistory_agent`,
          method: 'POST',
          body: formData,
        };
      },
    }),



    getAgentClientOrdersBarChartSubjectWise: builder.query({
      query: (data) => {
        const formData = new FormData();
        formData.append('agentid', data.agentId);
        formData.append('paper_subject', data.paper_subject);
        formData.append('batch', data.batch);
        return {
          url: `/rapel_chart_graph_data_subject_wise_agent`,
          method: 'POST',
          body: formData,
        };
      },
    }),

    getTopClientsData: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('agent_id', id);
        return {
          url: `/data_For_top_three_clients`,
          method: 'POST',
          body: formData,
        };
      },
    }),



    getAllPaperSubjectForOrders: builder.query({
      query: () => {
        return {
          url: `/get_paper_subject_values`,
          method: 'POST',
        };
      },
    }),


    getPaperTopicFromCourse: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('course_id', id);
        return {
          url: `/get_paper_topics_against_course`,
          method: 'POST',
          body: formData,
        };
      },
    }),



    getAllCoursesForOrder: builder.query({
      query: () => {
        return {
          url: `/get_courses_list`,
          method: 'POST',
        };
      },
    }),





    showBlinker: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('agent_id', id);
        return {
          url: `/blinker_api`,
          method: 'POST',
          body: formData,
        };
      },
    }),


    insertRequestRevesion: builder.mutation({
      query: (body) => {
        return {
          url: `/agent_Revision_mark_data`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['AgentBatchOrders', 'AgentBatchOrdersUnPaid'],
    }),

    getNotificationById: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('agent_id', id);
        return {
          url: `/get_notifications`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['Agentnotification'],
    }),

    markReadNotification: builder.mutation({
      query: (body) => {
        return {
          url: `/mark_read_notification`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Agentnotification'],
    }),




    getAgentPendingOrders: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('agent_id', id);
        return {
          url: `/agent_pending_orders_list`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['AgentPendingOrdersList'],
    }),

    deleteOrder: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append('id', data?.orderId);
        formData.append('agent_id', data?.agentId);
        return {
          url: `/delete_pending_orders`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['AgentPendingOrdersList'],
    }),

    movePendingOrder: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append('pendingorderid', data?.orderId);
        formData.append('agentid', data?.agetID);
        return {
          url: `/move_pending_orders`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [
        'AgentPendingOrdersList',
        'AgentBatchOrders',
        'AgentBatchOrdersUnPaid',
        'creditLimitAgent',
      ],
    }),
  }),
});

export const {
  useGetAgentCostDataQuery,
  useGetUniversityAndBatchesQuery,
  useGetCurrentMonthCostQuery,
  useGetPerformanceDataQuery,
  useGetAgentCreditLimitsQuery,
  useGetAgentOrdersDataMarksQuery,
  useGetAgentOrdersDataQuery,
  useGetPaperSubjectQuery,
  useGetTypeOfPaperQuery,
  useGetAgentOrdersListBatchQuery,
  useGetOrderDetailsByIdsMutation,
  useGetAgentAllClientsQuery,
  useGetAllClientsForOrderQuery,
  useGetAgentClientOrdersQuery,

  useGetAgentClientOrdersPieChartQuery,
  useGetAgentClientOrdersBarChartSubjectWiseQuery,

  useInsertRequestRevesionMutation,
  useGetNotificationByIdQuery,
  useMarkReadNotificationMutation,
  useGetTopClientsDataQuery,
  useGetAllPaperSubjectForOrdersQuery,
  useGetPaperTopicFromCourseQuery,
  // useGetAllCoursesForOrderQuery,
  useGetAllCoursesForOrderQuery,
  useShowBlinkerQuery,



  useGetAgentPendingOrdersQuery,
  useDeleteOrderMutation,
  useMovePendingOrderMutation
} = agentApi;
