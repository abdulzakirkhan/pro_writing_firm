// import { appNameCode } from '@config/index';
// import { api } from '@services/index';

import { appNameCode } from "../../config/indext";
import { api } from "../service";

export const faqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFaqCategory: builder.query({
      query: () => {
        return {
          url: `/get_faqs_categories?app=${appNameCode}`,
          method: 'GET',
        };
      },
    }),

    getFaqQuestions: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append('categorid', id);
        formData.append('app', appNameCode)
        return {
          url: `/get_faqs_categories_wise_data`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useGetFaqCategoryQuery,useGetFaqQuestionsQuery } = faqApi;
