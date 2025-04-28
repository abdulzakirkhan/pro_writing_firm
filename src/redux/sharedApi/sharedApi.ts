// import { APP_NAME_CODES } from '@config/constants';
// import { api } from '@services/index';

import { APP_NAME_CODES } from "../../config/indext";
import { api } from "../service";

export const sharedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getForceUpdateValues: builder.query({
      query: (APP_CODE_NAME) => {
        return {
          url: `/admin/${
            APP_CODE_NAME == APP_NAME_CODES.HYBRID_RESEARCH_CENTER
              ? 'forceupdateapi'
              : 'forceupdateapidss'
          }`,
          method: 'POST',
          body: {},
        };
      },
    }),
    getStandardValues: builder.query({
      query: (clientId) => {
        return {
          url: `/standard_values_for_api_agent${
            clientId ? '?agent_id=' + clientId : ''
          }`,
          method: 'GET',
        };
      },
    }),
    getAppReviewValues: builder.query({
      query: (userId) => {
        const formData = new FormData();
        formData.append('clientid', userId);
        return {
          url: `/admin/feedbackallow`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetForceUpdateValuesQuery,
  useGetStandardValuesQuery,
  useGetAppReviewValuesQuery,
} = sharedApi;
