import { useAuth } from "@/features/auth/login/model/useAuth";
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import type { ApiError } from "@/features/auth/login/api/type";
import conKhiImg from "@/shared/assets/img/conKhi.jpg";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/features/providers/UserProvider";

export function UserProfileMenu() {
    const { logout } = useAuth();
    const { user: userData, clearUser } = useUser();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            clearUser();
            await logout();
        } catch (error) {
            const apiError = error as ApiError;
            alert(apiError.message);
        }
    }

    return (
        <Menu as="div" className="relative p-4 border-gray-200 hover:bg-gray-100 transition-colors rounded-lg m-1">
                <Menu.Button className="w-full border-none outline-none">

                    <div className="flex items-center gap-2 w-full"> 
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-md bg-gray-200">
                            <img src={userData?.avatar_url || conKhiImg} alt="avatar" className="w-full h-full object-cover rounded-lg" />
                        </div>
                        
                        {/* Text */}
                        <div className="flex flex-col items-start">
                            <div className="text-sm font-medium select-none">{userData?.name}</div>
                            <div className="text-xs select-none">{userData?.email}</div>
                        </div>
                    </div>
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-full bottom-0 mb-1 ml-2 w-60 origin-bottom-left bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none shadow-md border border-gray-200">
            {/* User Info */}
            <div className="px-1 py-1">
                <div className="flex  items-center gap-2 p-2">
                    {/* avatar */}
                    <div className="w-8 h-8 rounded-md bg-gray-200">
                        <img src={userData?.avatar_url || conKhiImg} alt="avatar" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    {/* name */}
                    <div className="flex flex-col items-start">
                        <div className="text-sm font-medium select-none">{userData?.name}</div>
                        <div className="text-xs select-none">{userData?.email}</div>
                    </div>
                </div>
            </div>
            {/* Profile & Settings */}
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={() => navigate("/profile")}
                  >
                    <FiUser className="w-5 h-5 mr-2" />
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    <FiSettings className="w-5 h-5 mr-2" />
                    Settings
                  </button>
                )}
              </Menu.Item>
            </div>
            
            {/* Log out */}   
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={handleLogout}
                  >
                    <FiLogOut className="w-5 h-5 mr-2 text-gray-500" />
                    Log out
                  </button>
                )}
              </Menu.Item>
            </div>

          </Menu.Items>
                </Transition>
            </Menu>
    )
}