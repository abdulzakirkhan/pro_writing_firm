import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import { isValidPhoneNumber } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import toast, { Toaster } from "react-hot-toast";
import { useVerifySignupMutation } from "../../redux/auth/authApi";
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
    phone: Yup.string()
  .required('Phone number is required')
  .test(
    'is-valid-phone',
    'Invalid phone number',
    value => isValidPhoneNumber(value || '', 'PK') // 'PK' = Pakistan
  ),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords must match")
    .required("Confirm Password is required"),
});
export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate =useNavigate()

  const [verifySignup, { isLoading: signupUserLoading }] = useVerifySignupMutation();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit:async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('number',   values.phone);
        formData.append('email', values.email);
        formData.append('name', values.name);
        formData.append("applicationtype", "Prf");
        formData.append('password', values.password);
        formData.append('confirm_password', values.confirmPassword);
        // const formDataObj = Object.fromEntries(formData.entries());
        // console.log("formDataObj" , formDataObj)
        const signupRes= await verifySignup(formData);
        const { error, data: respData } = signupRes || {};
        if(error){
          console.log(error?.data?.message)
          toast.error(error?.data?.message)
        }
        // console.log("signupRes",signupRes)
        if (error){
          toast.error(error?.data?.message);
        }
        if (!error){
        toast.success(respData?.result?.status);
        resetForm()
        navigate("/signin")
        }
      } catch (error) {
        console.log("Error" ,error)
      }
    }
  })

  return (
    <>
    <div className="flex flex-col flex-1 lg:justify-center items-center -mt-6">
      <div className="w-[233px]">
        <img src="/images/logo/favicon.png" alt="Logo" className="w-full" />
      </div>
      <h1 className="text-center text-2xl lg:text-4xl font-bold">Signup to Get Started!</h1>

      <form onSubmit={formik.handleSubmit} className="w-full max-w-md px-4 mt-4">
        {/* Name Input */}
        <div className="mb-2">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-200">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-2">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        {/* Phone Input */}
        <div className="mb-2">
        <label htmlFor="phone" className="block text-gray-700 dark:text-gray-200">
          Phone Number
        </label>
        <div className="relative w-full">
          <PhoneInput
            country={'us'}
            value={formik.values.phone}
            onChange={(phone) => formik.setFieldValue('phone', phone)}
            onBlur={formik.handleBlur}
            inputProps={{
              name: 'phone',
              id: 'phone',
              required: true
            }}
            inputClass="!w-full px-4 !py-5 pl-14 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            buttonClass="!left-1 !top-1/2 !-translate-y-1/2 !bg-transparent !border-0 !p-0 dark:!bg-gray-800"
            dropdownClass="dark:bg-gray-800 dark:text-white dark:border-gray-700"
            containerClass="react-tel-input"
          />
        </div>
        {formik.touched.phone && formik.errors.phone && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
        )}
      </div>

        {/* Password Input */}
        <div className="mb-2">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-200">
            Password
          </label>
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
                alt={showPassword ? "Hide password" : "Show password"} 
                className="w-[24px]" 
              />
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="mb-2">
          <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-200">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-sm absolute top-3 end-4 text-primary-600 dark:text-primary-400"
            >
              <img 
                src="/images/icons/visible.png" 
                alt={showConfirmPassword ? "Hide password" : "Show password"} 
                className="w-[24px]" 
              />
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center px-10 mb-3">
          <button
            type="submit"
            className="w-full bg-[#13A09D] text-white py-2 px-4 rounded-lg hover:bg-[#0F7F7C] transition-colors"
          >
            Sign Up
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center text-sm">
          <span className="text-black">Already have an account? </span>
          <Link
            to="/signin"
            className="text-black font-bold"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
    <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}