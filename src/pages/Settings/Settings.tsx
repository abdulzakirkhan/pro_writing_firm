import { useEffect, useRef, useState } from "react";
import { useTitle } from "../../context/TitleContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LuEyeClosed } from "react-icons/lu";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/profileApi/profileApi";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { ChangeUser } from "../../redux/auth/authSlice";
export default function Settings() {
  const user = useSelector((state) => state.auth?.user);
  const { data: profileData } = useGetProfileQuery(user?.agent_user_id);
   const [updateProfile, { isLoading: updateProfileLoading }] =useUpdateProfileMutation();
  const { setTitle } = useTitle();
  const [activeTab, setActiveTab] = useState("profile");
  const [changePassword, { isLoading: changePasswordLoading }] =
    useChangePasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(profileData?.filepath || "")
  const tabClass = (tab: string) =>
    `cursor-pointer text-sm font-medium px-4 pb-2 ${
      activeTab === tab
        ? "text-[#6da5f9] border-[#6da5f9]"
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
    const handleImageClick = () => {
    fileInputRef.current?.click();
  };
const allowedTypes = ['image/png'];
    const handleFileChange =async (e) => {
    const file = e.target.files[0];
    if (!file) return;

  if (!allowedTypes.includes(file.type)) {
    toast.error("Only PNG images are allowed.");
    return;
  }
      const formData = new FormData();
      formData.append('imageof', file);
      formData.append("clientid", user?.agent_user_id);
    try {
    const response = await updateProfile(formData).unwrap();
    // console.log("response :",response)
    if (response?.filepath) {
      toast.success("Profile Image Updated Successfully !")
      setImage(response.imageUrl);
      // toast.success("Updated Successfully !")
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
      };
      reader.readAsDataURL(file);
    }

  } catch (error) {
    toast.error("Failed to upload profile image.")
  }
  };
  useEffect(() => {
    if (profileData?.name) {
      setName(profileData?.name);
      setEmail(profileData?.email);
      setImage(profileData?.filepath)
    }
  }, [profileData]);
  const dispatch = useDispatch();

  const ProfileTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative">
            <img
              src={image}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-bold text-lg">{profileData?.name}</p>
            <p className="text-sm text-gray-500">{profileData?.email}</p>
          </div>
        </div>
        {/* <button type="submit" className="bg-[#6da5f9] text-white px-4 py-1 rounded">
          Edit
        </button> */}
      </div>
      <Formik
        initialValues={{
          name: profileData?.name || "",
          email: email || "",
          phone: profileData?.number || "",
        }}
        onSubmit={async(values) => {
          console.log("Submitting", values);
          // Call your submit handler
          const formData = new FormData();
          formData.append("clientid", user?.agent_user_id);
          if (name) formData.append("name", values.name);
          // if (email) formData.append('email', email);
          // if (profileImage?.uri)
          //   formData.append('imageof', {
          //     uri: data?.profileImage.uri,
          //     type: data?.profileImage.type,
          //     name: data?.profileImage.fileName,
          //   });

          const res = await updateProfile(formData);
          if (res?.data) {
            toast.success("Profile Updated Successfully.");
            dispatch(ChangeUser({ ...user, clientname: name }));
          }
          if (res?.error) toast.success("Something went wrong.");
        }}
      >
        {({ handleBlur }) => (
          <Form className="grid grid-cols-1 gap-4 relative text-sm">
            <div className="mb-2 flex flex-col gap-2">
              <label
                htmlFor="name"
                className="!text-[#6D6D6D] text-lg font-semibold"
              >
                Name
              </label>
              <Field
                name="name"
                placeholder="Name"
                onBlur={handleBlur}
                className="border rounded p-3 col-span-1"
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
                readOnly
                className="border rounded p-3 col-span-2"
                placeholder="Email"
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
                readOnly
                className="border rounded p-3 col-span-2"
                placeholder="Phone No"
              />
            </div>

            <div className="lg:col-span-2 text-center">
              <button
                type="submit"
                className="bg-[#6da5f9] text-white px-4 py-1 w-1/3 rounded-lg h-[34px]"
              >
                Update
              </button>
            </div>
          </Form>
        )}
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
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#6da5f9] rounded-full peer peer-focus:ring-2 ring-[#6da5f9] transition duration-300"></div>
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
          <h4 className="text-md font-semibold text-[#6da5f9] mb-2">
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
                  <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#6da5f9] rounded-full transition duration-300"></div>
                  <div className="absolute w-4 h-4 left-1 top-1 bg-white rounded-full shadow peer-checked:translate-x-5 transition duration-300"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const UpdatePassword = () => {
    const [showEye, setShowEye] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState(false);
    const navigate = useNavigate();
    const passwordSchema = Yup.object().shape({
      oldPassword: Yup.string().required("Old Password is required"),
      newPassword: Yup.string()
        .min(6, "New Password must be at least 6 characters")
        .required("New Password is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm New Password is required"),
    });

    const handleSubmit = async (values) => {
      try {
        const formData = new FormData();
        formData.append("clientid", user?.agent_user_id);
        formData.append("oldpassword", values?.oldPassword);
        formData.append("newpassword", values?.newPassword);
        formData.append("confirmpassword", values?.confirmNewPassword);

        // console.log("VALUES.CONFIRMNEWPASSWORD",values.confirmNewPassword)
        // return
        const res = await changePassword(formData);

        const { data: respData, error } = res || {};
        if (respData?.result == "Password Updated Successfully") {
          toast.success(respData?.result || "SUCCEESS !");
        } else {
          toast.error(respData?.result);
        }
      } catch (error) {
        toast.error("Something went wrong.");
      }
    };
    const handleClick = () => {
      setShowEye(!showEye);
    };

    const newPassword = () => {
      setShowNewPassword(!showNewPassword);
    };
    const confirmNewPasswordFunc = () => {
      setConfirmNewPassword(!confirmNewPassword);
    };
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Update Password</h2>

        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          validationSchema={passwordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Old Password
                </label>
                <div className="relative">
                  <Field
                    type={showEye ? "text" : "password"}
                    name="oldPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  {showEye ? (
                    <IoEye
                      onClick={handleClick}
                      size={25}
                      className="absolute top-2 cursor-pointer right-4"
                    />
                  ) : (
                    <IoEyeOff
                      onClick={handleClick}
                      size={25}
                      className="absolute top-2 cursor-pointer right-4"
                    />
                  )}
                </div>
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  New Password
                </label>

                <div className="relative">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  {showNewPassword ? (
                    <IoEye
                      onClick={newPassword}
                      size={25}
                      className="absolute top-2 cursor-pointer right-4"
                    />
                  ) : (
                    <IoEyeOff
                      onClick={newPassword}
                      size={25}
                      className="absolute top-2 cursor-pointer right-4"
                    />
                  )}
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Field
                    type={confirmNewPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  {confirmNewPassword ? (
                    <IoEye
                      onClick={confirmNewPasswordFunc}
                      size={25}
                      className="absolute top-2 cursor-pointer right-4"
                    />
                  ) : (
                    <IoEyeOff
                      onClick={confirmNewPasswordFunc}
                      size={25}
                      className="absolute top-2 cursor-pointer right-4"
                    />
                  )}
                </div>
                <ErrorMessage
                  name="confirmNewPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#6da5f9] text-white py-2 rounded-md w-full"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  };
  useEffect(() => {
    setTitle("Settings");
    // toast.success("Loaded")
  }, [setTitle]);

  console.log("user :",user)
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />

      <div className="p-6">
        {/* Tab Header */}
        <div className="flex justify-center gap-6 mb-6">
          <span
            className={`${tabClass("profile")} text-[24px]`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </span>
          {/* <span
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
          </span> */}
          <span
            className={`${tabClass("updateProfile")} text-[24px]`}
            onClick={() => setActiveTab("updateProfile")}
          >
            Update Password
          </span>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl p-6 shadow w-full max-w-3xl mx-auto">
          {activeTab === "profile" && <ProfileTab />}
          {/* {activeTab === "notifications" && <NotificationsTab />} */}
          {/* {activeTab === "customization" && <CustomizationTab />} */}
          {activeTab === "updateProfile" && <UpdatePassword />}
        </div>
      </div>
    </>
  );
}
