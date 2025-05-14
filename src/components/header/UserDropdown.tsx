import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../../redux/profileApi/profileApi";
import { useEffect, useState } from "react";


export default function UserDropdown() {
  const user = useSelector((state) => state.auth?.user);
  const { data: profileData } = useGetProfileQuery(user?.agent_user_id);
  const [Image, setImage] = useState(profileData?.filepath || "")

  useEffect(() => {
    if(profileData?.filepath) {
      setImage(profileData?.filepath)
    }
  }, [profileData])
  
  return (
    <div className="relative">
      <div
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src={Image} alt="" w-full h-full />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{profileData?.name}</span>
       
      </div>
    </div>
  );
}
