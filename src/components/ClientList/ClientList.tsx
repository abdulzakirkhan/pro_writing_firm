import { FaArrowRight } from "react-icons/fa";
import { PiGraduationCapDuotone } from "react-icons/pi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import "../../styles/scrollbar.css";
import Calendar from "../../assets/icons/calendar.png"

// // Sample client data
// const clients = [
//   { id: 1, name: "Client Name",education:"Master’s in Computer Science",email:"client@gmail.com",password:"client12345",icon:Calendar,performance:8.5,orders:0.5, university: "University name here", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
//   { id: 2, name: "Client Name",education:"Master’s in Computer Science",email:"client@gmail.com",password:"client12345",icon:Calendar,performance:8.5,orders:0.5, university: "University name here", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
//   { id: 3, name: "Client Name",education:"Master’s in Computer Science",email:"client@gmail.com",password:"client12345",icon:Calendar,performance:8.5,orders:0.5, university: "University name here", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
//   { id: 4, name: "Client Name",education:"Master’s in Computer Science",email:"client@gmail.com",password:"client12345",icon:Calendar,performance:8.5,orders:0.5, university: "University name here", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
//   { id: 5, name: "Client Name",education:"Master’s in Computer Science",email:"client@gmail.com",password:"client12345",icon:Calendar,performance:8.5,orders:0.5, university: "University name here", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
//   { id: 6, name: "Client Name",education:"Master’s in Computer Science",email:"client@gmail.com",password:"client12345",icon:Calendar,performance:8.5,orders:0.5, university: "University name here", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
//   { id: 7, name: "Client Name",education:"Master’s in Computer Science",email:"client@gmail.com",password:"client12345",icon:Calendar,performance:8.5,orders:0.5, university: "University name here", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
// ];

const avatar ="https://randomuser.me/api/portraits/men/3.jpg"

const ClientList = ({handleClickProfile,clientProfileOpen,clientProfile, client}) => {
 
  const profileClick = (client) => {
    handleClickProfile(client)
    clientProfileOpen(!clientProfile)
  }
  return (
    <>
      {/* {clients.map((client) => ( */}
        <div
          key={client.id}
          className="flex cursor-pointer items-center justify-between h-[90px] py-2 border-b last:border-none"
          onClick={() => profileClick(client)}
        >
          {/* Avatar + Name */}
          <div className="flex items-center gap-3">
            <img
              src={client.avatar ? client.avatar : avatar}
              alt="Client Avatar"
              className="w-[56px] h-[56px] rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-black text-lg">{client.name}</p>
              <p className="flex items-center gap-1 text-[16px] text-gray-500">
                <PiGraduationCapDuotone size={25} className="" />
                {client.university}
              </p>
            </div>
          </div>
          <MdOutlineKeyboardArrowRight size={35} className="text-teal-500 text-sm" />
        </div>
      {/* ))} */}
    </>
  );
};

export default ClientList;
