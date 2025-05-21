import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { ChangeUser, setCredentials } from "../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { useVerifyLoginFeildsMutation } from "../../redux/auth/authApi";
const validationSchema = Yup.object().shape({
  loginId: Yup.string().required("User ID or Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyLoginFeidls, { isLoading: verifyLoginFeidlsLoading }] =
    useVerifyLoginFeildsMutation();
  const dispatch = useDispatch();
  const navigate =useNavigate()
  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const body = new FormData();

        body.append("agent_id", values.loginId);
        body.append("agent_pass_key", values.password);
        body.append("applicationtype", "Prf");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Determine if userId is an email
        if (emailRegex.test(values.loginId)) {
          body.append("isemail", "2");
        } else {
          body.append("isemail", "1");
        }
        const res = await verifyLoginFeidls(body);
        const { error, data: respData } = res || {};
        

        

        // Handle known API error
        if (respData?.error) {
          toast.error(
            typeof respData.error === 'string'
              ? respData.error
              : respData.message || 'Login failed. Please check your credentials.'
          );
          return;
        }

        // Handle successful login
        if (respData && !respData.error) {
          console.log("respData",respData?.result)
          dispatch(
            setCredentials({
              user: respData?.result,
              token: respData?.result?.authorization_token,
            })
          );
          toast.success("Logged in successfully!");
          navigate("/")
          return;
        }
        // Handle unexpected error
        if (error) {
          toast.error("Something went wrong. Please try again later.");
        }
      } catch (error) {
        setErrorMessage("Something Went Wrong");
        // setOpenSnackbar(true);
      }
    },
  });

  return (
    <>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
    <div className="flex flex-col flex-1 lg:justify-center items-center">
      <div className="w-[233px] bg-none">
        <img src="/images/favicon.png" alt="Logo" className="w-full" />
      </div>
      <h1 className="text-center text-2xl lg:text-4xl font-bold">
        Login to Get Started!
      </h1>

      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md px-4 mt-6"
      >
        {/* User ID/Email Input */}
        <div className="mb-6">
          <label
            htmlFor="loginId"
            className="block text-gray-700 dark:text-gray-200 mb-2"
          >
            User ID or Email
          </label>
          <input
            id="loginId"
            name="loginId"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.loginId}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          {formik.touched.loginId && formik.errors.loginId && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.loginId}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm absolute top-3 end-4 text-primary-600 dark:text-primary-400"
            >
              <img
                src="/images/icons/visible.png"
                alt=""
                className="w-[24px]"
              />
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          )}
        </div>

        {/* Forgot Links */}
        <div className="flex justify-end mb-6 text-sm">
          <Link
            to="/forgot-userid"
            className="text-blue-700 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Forgot User Id or Password?
          </Link>
        </div>

        {/* Login Button */}
        <div className="text-center px-10">
          <button
            type="submit"
            className="w-full bg-[#6da5f9] text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Login
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-black">Don't have an account? </span>
          <Link to="/signup" className="text-black font-bold">
            Sign up
          </Link>
        </div>
      </form>
    </div>
    </>
  );
}
