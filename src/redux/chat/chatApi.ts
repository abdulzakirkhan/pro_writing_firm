import { api } from "../service";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: ({ id, page }) => {
        const formData = new FormData();
        formData.append("agent_id", id);
        formData.append("lastid", page);
        return {
          url: `/loadmorechatonappagent`,
          method: "POST",
          body: formData,
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentData, newData, { arg }) => {
        if (!currentData) return newData;
        else if (newData?.result?.[0] == "No Record Found Against This ID")
          return currentData;
        else {
          return { result: [...currentData?.result, ...newData?.result] };
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ["Chat"],
    }),
    insertClientMesageThroughApp: builder.mutation({
      query: (body) => {
        return {
          url: `/insertclientmsgthroughappagent`,
          method: "POST",
          body,
        };
      },
    }),
    getCurrentUserChatSession: builder.query({
      query: (id) => {
        const formData = new FormData();
        formData.append("agent_id", id);
        return {
          url: `/On_Chat_screenshot_session_status_get`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useInsertClientMesageThroughAppMutation,
  useGetCurrentUserChatSessionQuery,
  useLazyGetCurrentUserChatSessionQuery,
} = chatApi;
