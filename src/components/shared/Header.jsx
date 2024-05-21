import React, { Fragment, useEffect, useState } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { HiOutlineBell, HiOutlineSearch, HiOutlineChatAlt } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import axios from 'axios'
import Customer_detail from '../../pages/Customer_detail'
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
export default function Header() {
    const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async () => {
        try {
            if (!searchTerm.trim()) {
                console.error("Search term is required.");
                return;
            }

            const response = await axios.get(`http://localhost:4000/user/search`, {
                params: {
                    fullName: searchTerm
                }
            });
            console.log(response.data);
            setSearchResults(response.data.data);
            setShowResults(true);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
	const handleResultClick = (userId) => {
		console.log(`Clicked on result with ID ${userId}`);
		navigate(`/customers_detail/${userId}`);
		setShowResults(false);

    }


    function renderLogin() {
        const Token = Cookies.get("Token");
    
        if (Token) {
          return (
            <>
               <Menu.Item>
                                {({ active }) => (
                                    <div
                                        className={classNames(
                                            active && 'bg-gray-100',
                                            'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                                        )}
                                    >
                                          <a className="ctive:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200" onClick={logout}>
              Thoát
            </a>
                                    </div>
                                )}
                            </Menu.Item>
            </>
          );
        } else {
          return (
            <div className="position-relative">
              <Link to={"/register"} width={170} className="sc-eDWCr kzpCjd">
                Đăng Nhập
              </Link>
            </div>
          );
        }
      }
      function logout() {
        Cookies.remove("Token");
        
    
        navigate("/register");
      }
    return (
        <div className="bg-white h-16 px-4 flex items-center border-b border-gray-200 justify-between">
       <div className="relative">
            <HiOutlineSearch fontSize={20} className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[24rem] h-10 pl-11 pr-4 rounded-sm"
            />
            {showResults && (
                <div className="absolute z-10 bg-white w-[24rem] border border-gray-300 rounded-sm mt-1">
                    {searchResults.map((result) => (
                        <div
                            key={result.userId}
                            className="p-2.5 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleResultClick(result.userId)}
							to={`/customers_detail/${result.userId}`}
					   >
                            {result.fullName}
							
                        </div>
						
                    ))}
					
                </div>
				
            )}
      <button onClick={handleSearch}>
            <SearchIcon />

      </button>
        </div>
            <div className="flex items-center gap-2 mr-2">
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={classNames(
                                    open && 'bg-gray-100',
                                    'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'
                                )}
                            >
                                <HiOutlineChatAlt fontSize={24} />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                                    <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                                        <strong className="text-gray-700 font-medium">Messages</strong>
                                        <div className="mt-2 py-1 text-sm">This is messages panel.</div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={classNames(
                                    open && 'bg-gray-100',
                                    'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'
                                )}
                            >
                                <HiOutlineBell fontSize={24} />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                                    <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                                        <strong className="text-gray-700 font-medium">Notifications</strong>
                                        <div className="mt-2 py-1 text-sm">This is notification panel.</div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
                <Menu as="div" className="relative">
                    <div>
                        <Menu.Button className="ml-2 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
                            <span className="sr-only">Open user menu</span>
                            <div
                                className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
                                style={{ backgroundImage: 'url("https://source.unsplash.com/80x80?face")' }}
                            >
                                <span className="sr-only">Marc Backes</span>
                            </div>
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        onClick={() => navigate('/profile')}
                                        className={classNames(
                                            active && 'bg-gray-100',
                                            'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                                        )}
                                    >
                                        Your Profile
                                    </div>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        onClick={() => navigate('/settings')}
                                        className={classNames(
                                            active && 'bg-gray-100',
                                            'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                                        )}
                                    >
                                        Settings
                                    </div>
                                )}
                            </Menu.Item>
                           {renderLogin()}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    )
}
