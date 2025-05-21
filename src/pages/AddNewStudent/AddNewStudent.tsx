import React, { useEffect, useState } from "react";
import { useAgentClientRegistarMutation } from "../../redux/agentdashboard/agentApi";
import { appNameCode } from "../../config/indext";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import { useTitle } from "../../context/TitleContext";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router";
export default function AddNewStudent() {
  const user = useSelector((state) => state.auth?.user);
const { setTitle } = useTitle();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    appNameCode: appNameCode,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setForm({ ...form, phone: value });
  };
  const [addClient, { isLoading: addClientLoading }] =
    useAgentClientRegistarMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (form.phone) {
      if (form.phone.startsWith("92")) {
        toast.error("Selected Country is not allowed");
        return;
      }
    }

    formData.append("number", "+" + form.phone);
    formData.append("email", form.email);
    formData.append("name", form.name);
    formData.append("appName", form.appNameCode);
    formData.append("agent_id", user?.agent_user_id);

    const signupRes = await addClient(formData);
    const { error, data: respData } = signupRes || {};

    if (error) {
      toast.error("Something went wrong");
      return;
    }
    console.log("respData :", respData);
    if (!error) {
      toast.success(respData?.result || "Client Added Successfully");
      setForm({
        name: "",
        email: "",
        phone: ""
      })
    }
  };


    useEffect(() => {
      setTitle("Add New Stduent");
      // toast.success("Loaded")
    }, [setTitle]);
  return (
    <>
      <div className="">
        <Link to={"/initiate-order"} className="text-[#6da5f9]"><IoMdArrowBack size={35} /></Link>
      </div>





      <div className="flex justify-center items-center">
        <div className="mx-auto w-1/2 mt-1 p-6 bg-white rounded-lg shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add New Student
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
                >
                Full Name
                </label>
                <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="John Doe"
                required
                />
            </div>

            <div>
                <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
                >
                Email Address
                </label>
                <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="john@example.com"
                required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
                </label>
                <PhoneInput
                country={"us"}
                value={form.phone}
                onChange={handlePhoneChange}
                inputProps={{
                    name: "phone",
                    required: true,
                    className:
                    "w-full px-12 py-2.5 border border-gray-300 rounded-lg  outline-none transition-all",
                }}
                containerClass="w-full"
                dropdownClass="z-10 bg-white border border-gray-200 rounded-lg shadow-lg"
                buttonClass="p-2.5 border-r border-gray-200 bg-gray-50 rounded-l-lg"
                className="flex items-center"
                international
                withCountryCallingCode
                />
            </div>

            <button
                type="submit"
                className="w-full bg-[#6986F5] text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {addClientLoading ? "Adding..." : "Add Student"}
            </button>
            </form>
        </div>
      </div>
    </>
  );
}
