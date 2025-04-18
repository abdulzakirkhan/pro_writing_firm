// src/redux/auth/authApi.ts
import { api } from "../service";

// -----------------------------------
// Types for request payloads
// -----------------------------------
export interface SignupBody {
  phoneNumber: string;
  email: string;
  name: string;
  appNameCode: string;
  newPassword: string;
  confirmPassword: string;
  applicationtype:string
}

export interface VerifyLoginBody {
  agent_id: string;
  agent_pass_key: string;
  applicationtype: string;
  isemail: '1' | '2';
}

export interface FCMTokenPayload {
  client_id: string;
  token: string;
}

export interface OTPPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

// -----------------------------------
// API Definition
// -----------------------------------
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    verifySignup: builder.mutation<void, SignupBody>({
      query: (formData) => ({
        url: `/agent_sign_up_api`,
        method: 'POST',
        body:formData
      }),
    }),
    
    verifyLoginFeilds: builder.mutation<void, VerifyLoginBody>({
      query: (body) => ({
        url: `/sign_In_agent`,
        method: 'POST',
        body,
      }),
    }),

    
    verifyClientNumber: builder.mutation<void, { number: string }>({
      query: (body) => ({
        url: `/admin/Apicon/verifyno`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    getToken: builder.query<void, void>({
      query: () => {
        const formData = new FormData();
        formData.append('email', 'muhammad.saad@egeeks.org');
        formData.append('pass', '1234');
        return {
          url: `/API_NEW/api/v1/generateToken`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    sendFCMToken: builder.mutation<void, FCMTokenPayload>({
      query: (body) => ({
        url: `admin/insertclientdevicetoken`,
        method: 'POST',
        body,
      }),
    }),
    forgotPasswordOtpRequet: builder.mutation<void, OTPPayload>({
      query: (body) => ({
        url: `/admin/forget_user_password`,
        method: 'POST',
        body,
      }),
    }),
    verifyForgotPasswordOtp: builder.mutation<void, OTPPayload>({
      query: (body) => ({
        url: `/admin/verify_password_otp`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    resetPassword: builder.mutation<void, ResetPasswordPayload>({
      query: (body) => ({
        url: `/admin/update_user_password`,
        method: 'POST',
        body,
      }),
    }),
    getOnboardings: builder.query<void, void>({
      query: () => ({
        url: `on_boarding_agent`,
        method: 'POST',
      }),
    }),
  }),
});

// -----------------------------------
// Auto-generated hooks
// -----------------------------------
export const {
  useVerifySignupMutation,
  useVerifyLoginFeildsMutation,
  useVerifyClientNumberMutation,
  useGetTokenQuery,
  useSendFCMTokenMutation,
  useForgotPasswordOtpRequetMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useGetOnboardingsQuery,
} = authApi;
