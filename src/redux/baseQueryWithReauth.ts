// src/redux/baseQueryWithReauth.ts
import { fetchBaseQuery, FetchBaseQueryError, BaseQueryFn } from '@reduxjs/toolkit/query/react';
// import type { RootState } from '../store'; // Adjust path if needed
import  logOut, {setCredentials}  from './auth/authSlice'; // ✅ Fix export name
import { RootState } from './store';
import { baseUrl } from '../config/indext';

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  formattedEmployee: any; // Ideally, replace `any` with your Employee/User interface
}

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    api.dispatch(logOut());
    api.util.resetApiState();
  }

  return result;
};
