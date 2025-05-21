import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../../redux/profileApi/profileApi";
import { useEffect, useRef, useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router";

export default function UserDropdown({setShowLogoutModal}) {
   const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth?.user);
  const { data: profileData } = useGetProfileQuery(user?.agent_user_id);
  const [Image, setImage] = useState(profileData?.filepath || "");
  const [profile, setProfile] = useState(false);
  useEffect(() => {
    if (profileData?.filepath) {
      setImage(profileData?.filepath);
    }
  }, [profileData]);

  const handleClick = () => {
    setProfile(!profile)
  }
    // 👇 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400">
        {/* Profile */}
        <span onClick={handleClick} className="mr-3 cursor-pointer overflow-hidden rounded-full h-11 w-11">
          <img src={Image} alt="" className="w-full h-full object-cover" />
        </span>

        {profile && (
          <div className="absolute top-14 right-2 bg-white border border-gray-200 rounded-lg shadow-lg w-56 z-50 transition-all duration-200">
            {/* Profile Preview */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700 truncate">
                {profileData?.name || "name"}
              </p>
              <p className="text-xs text-gray-500 truncate">{profileData?.email || "abcd"}</p>
            </div>

            {/* Menu Items */}
            <ul className="py-2 space-y-1">
              <li>
                <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <Link to={"/settings"}>Settings</Link>
                  <CiSettings className="ml-2 text-gray-500" size={20} />
                </button>
              </li>
              <li>
                <button
                  // onClick={handleLogout}
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span>Logout</span>
                  <IoMdLogOut className="ml-2 text-red-500" size={20} />
                </button>
              </li>
            </ul>
          </div>
        )}

        <span className="block mr-1 font-medium text-theme-sm">
          {profileData?.name}
        </span>
      </div>
    </div>
  );
}
