
import { useNavigate } from "react-router-dom";
import applogo from "../assets/appLogo.png";
import menuIcon from "../assets/menuIcon.png";
import searchIcon from "../assets/searchIcon.png";

const Sidebar = ({selectedUser, setSelectedUser}) => {

    const navigate = useNavigate();
  return (
    <div className={`h-full p-5 rounded-r-xl overflow-y-auto text-gray-900 ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className="pb-5">
        <div className="flex justify-between items-center">
            <img src={applogo} alt="whispLogo" className="h-[5vh]" />
            <div className="relative py-2 group">
                <img src={menuIcon} alt="menu" className="max-h-6 cursor-pointer" />
                <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-sky-300 border border-gray-300 text-gray-700 hidden group-hover:block">
                    <p onClick={() => navigate('/profile')} className="cursor-pointer text-sm">Edit Profile</p>
                    <hr className="my-2 border-t border-gray-700" />
                    <p className="cursor-pointer text-sm">Logout</p>
                </div>
            </div>
        </div>
    
        <div className="bg-sky-200 rounded-full flex items-center gap-2 py-3 px-4 mt-5">
            <img src={searchIcon} alt="search" className="h-[2.5vh]" />
            <input type="text" className="bg-transparent border-none outline-none text-gray-700 text-xs flex-1" placeholder="Search User..." />
        </div>

      </div>
    </div>
  )
}

export default Sidebar
