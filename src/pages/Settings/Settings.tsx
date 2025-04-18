import { useEffect, useState } from "react";
import { useTitle } from "../../context/TitleContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LuEyeClosed } from "react-icons/lu";
import * as Yup from "yup";
export default function Settings() {
  const { setTitle } = useTitle();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const tabClass = (tab: string) =>
    `cursor-pointer text-sm font-medium px-4 pb-2 ${
      activeTab === tab
        ? "text-[#13A09D] border-[#13A09D]"
        : "text-gray-500 border-transparent"
    }`;
  const notifications = [
    { name: "Turn on all Chat Notification", enabled: true },
    { name: "Order Status Update Notification", enabled: false },
    { name: "Payment Notification", enabled: true },
    { name: "Credit limit Notification", enabled: false },
  ];
  const dashboardOptions = [
    {
      group: "Dashboard",
      options: [
        "Show Revenue Graph",
        "Metrics",
        "Performance Graph",
        "Overall Performance",
        "Batch wise variation",
        "Pie Chart",
      ],
    },
    { group: "Orders", options: ["Metrics", "Pie Chart"] },
    { group: "Clients", options: ["Graphs", "Pie Chart"] },
  ];
  const ProfileTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-bold text-lg">User Full Name</p>
            <p className="text-sm text-gray-500">useremail@gmail.com</p>
          </div>
        </div>
        {/* <button type="submit" className="bg-[#13A09D] text-white px-4 py-1 rounded">
          Edit
        </button> */}
      </div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required("First name is required"),
          lastName: Yup.string().required("Last name is required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
          phone: Yup.string().required("Phone number is required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={(values) => {
          console.log("Form values:", values);
        }}
      >
        <Form className="grid grid-cols-2 gap-4 relative text-sm">
          <div className="mb-2 flex flex-col gap-2">
            <label
              htmlFor="firstName"
              className="!text-[#6D6D6D] text-lg font-semibold"
            >
              First Name
            </label>
            <Field
              name="firstName"
              type="text"
              className="border rounded p-3 col-span-1"
              placeholder="First Name"
            />
            <ErrorMessage
              name="firstName"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>

          <div className="mb-2 flex flex-col gap-2">
            <label
              htmlFor="lastName"
              className="!text-[#6D6D6D] text-lg font-semibold"
            >
              Last Name
            </label>
            <Field
              name="lastName"
              type="text"
              className="border rounded p-3 col-span-1"
              placeholder="Last Name"
            />
            <ErrorMessage
              name="lastName"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>

          <div className="mb-2 lg:col-span-2 flex flex-col gap-2">
            <label
              htmlFor="email"
              className="!text-[#6D6D6D] text-lg font-semibold"
            >
              Email
            </label>
            <Field
              name="email"
              type="email"
              className="border rounded p-3 col-span-2"
              placeholder="Email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>

          <div className="mb-2 lg:col-span-2 flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="!text-[#6D6D6D] text-lg font-semibold"
            >
              Phone No
            </label>
            <Field
              name="phone"
              type="tel"
              className="border rounded p-3 col-span-2"
              placeholder="Phone No"
            />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>

          <div className="mb-2 lg:col-span-2 flex flex-col gap-2 relative">
            <label
              htmlFor="password"
              className="!text-[#6D6D6D] text-lg font-semibold"
            >
              Password
            </label>

            <Field
              name="password"
              type={`${showPassword ? "text" : "password"}`}
              className="border rounded p-3 col-span-2"
              placeholder="Password"
            />

            <LuEyeClosed
              onClick={() => setShowPassword(!showPassword)}
              size={30}
              className="text-[#6D6D6D] cursor-pointer absolute top-11 end-4"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>

          <div className="lg:col-span-2 ">
            <button
              type="submit"
              className="bg-[#13A09D] !absolute -top-20 !end-0 text-white px-4 py-1 rounded-lg w-[69px] h-[34px]"
            >
              Edit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
  const NotificationsTab = () => {
    return (
      <div className="space-y-4">
        {notifications.map((n, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border-b pb-2"
          >
            <span className="text-sm">{n.name}</span>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={n.enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#13A09D] rounded-full peer peer-focus:ring-2 ring-[#13A09D] transition duration-300"></div>
              <div className="absolute ml-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition duration-300"></div>
            </label>
          </div>
        ))}
      </div>
    );
  };
  const CustomizationTab = () => (
    <div className="space-y-6">
      {dashboardOptions.map((section, idx) => (
        <div key={idx}>
          <h4 className="text-md font-semibold text-[#13A09D] mb-2">
            {section.group}
          </h4>
          <div className="space-y-3">
            {section.options.map((opt, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b pb-1 relative"
              >
                <span>{opt}</span>

                {/* Custom toggle switch */}
                <label className="inline-flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    defaultChecked={i % 2 === 0}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#13A09D] rounded-full transition duration-300"></div>
                  <div className="absolute w-4 h-4 left-1 top-1 bg-white rounded-full shadow peer-checked:translate-x-5 transition duration-300"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  useEffect(() => {
    setTitle("Settings");
  }, [setTitle]);

  return (
    <>
      <div className="p-6">
        {/* Tab Header */}
        <div className="flex justify-center gap-6 mb-6">
          <span
            className={`${tabClass("profile")} text-[24px]`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </span>
          <span
            className={`${tabClass("notifications")} text-[24px]`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </span>
          <span
            className={`${tabClass("customization")} text-[24px]`}
            onClick={() => setActiveTab("customization")}
          >
            Customization
          </span>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl p-6 shadow w-full max-w-3xl mx-auto">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "customization" && <CustomizationTab />}
        </div>
      </div>
    </>
  );
}
