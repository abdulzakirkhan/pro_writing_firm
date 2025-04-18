// src/redux/agentApi.ts
import { api } from '../service';
// src/types/agentApiTypes.ts

export interface AgentDashboardInput {
  agentId: string;
  university: string;
  batch: string;
  startDate: string;
  endDate: string;
}

export interface AgentOrdersInput {
  agentId: string;
  university: string;
  batch: string;
  paperSubject: string;
}

export interface OrderFilterInput {
  agentId: string;
  selectedFilterOrder: string;
  selectedTypePaper: string;
  selectedCategory: string;
}

export interface DeleteOrderInput {
  orderId: string;
  agentId: string;
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
        };
      },
      providesTags: ['AgentCostData'],
    }),

  }),
});

export const {
  useGetAgentCostDataQuery,
  // ... other hooks
} = agentApi;
