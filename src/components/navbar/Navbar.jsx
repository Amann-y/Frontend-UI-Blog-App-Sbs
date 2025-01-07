import React, { useState, useEffect } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/amann2.png";
import { useGlobalContext } from "../../context/useUserContext";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const token = localStorage.getItem("Blog-Token");
  const isAuth = localStorage.getItem("isAuth");

  const navigate = useNavigate();
  const location = useLocation();

  const { removeUserData, theme, toggleTheme, avatar } = useGlobalContext();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    removeUserData();
    localStorage.removeItem("Blog-Token");
    localStorage.removeItem("isAuth");
    navigate("/");
  };

  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery(null);
    }
  }, [location.pathname]);

  const handleSearchSubmit = () => {
    if (searchQuery?.trim()) {
      navigate(`/search?search=${searchQuery}`);
      setSearchQuery(''); // Clear the search input after submitting
      setShowModal(false); // Close the modal after search
    }
  };
  

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white">
      <div className="max-w-7xl mx-auto px-2 py-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between min-h-14">
          <div className="flex-1 flex items-center gap-2 flex-wrap sm:items-stretch sm:justify-start md:justify-between">
            <div className="">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-12 h-auto rounded animate__animated animate__slow animate__pulse animate__infinite"
                />
              </Link>
            </div>

            <div className="flex items-center">
              <input
                className=" hidden sm:inline-block p-1 md:px-2 w-full rounded-md md:rounded-full shadow focus:border-violet-500 outline-none text-black"
                placeholder="Search blogs"
                value={searchQuery ? searchQuery : ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search blogs"
                onKeyDown={(e) => {
                  if (e.code == "Enter") {
                    if (searchQuery.trim()) {
                      navigate(`/search?search=${searchQuery}`);
                    }
                  }
                }}
              />
            </div>

            <div className="hidden sm:flex sm:ml-6">
              <div className="flex space-x-4 animate__animated animate__fadeInDown animate__slower">
                <Link
                  to="/"
                  className="text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  About
                </Link>

                {!token || !isAuth ? (
                  <>
                    <Link
                      to="/login"
                      className="text-black hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-black hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Sign-Up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/user-info"
                      className="text-black hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Account Info
                    </Link>
                    <Link
                      to="/user-blogs"
                      className="text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      Your Blogs
                    </Link>
                    <Link
                      to="/create-blog"
                      className="text-black hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Create Blog
                    </Link>

                    <Link
                      to="/login"
                      className="text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center gap-1"
                      onClick={handleLogout}
                    >
                      {avatar && <img src={avatar} alt="Avatar" className="w-5 rounded-full" />}
                      Logout
                    </Link>
                  </>
                )}

                <button
                  onClick={toggleTheme}
                  className="lg:px-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
                </button>
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            {/* Search icon to open modal */}
            <div
              onClick={() => setShowModal(true)} // Open modal on click
              className="cursor-pointer"
            >
              <CiSearch size={25} className="mx-1" />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-xl text-gray-100 hover:text-white hover:bg-gray-700"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Search Input */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)} // Close modal when clicked outside
        >
          <div
            className="bg-gray-200 p-6 rounded-lg shadow-xl w-11/12 sm:w-96"
            onClick={(e) => e.stopPropagation()} // Prevent click event from propagating
          >
            <input
              className="w-full p-3 rounded-md shadow-md focus:border-violet-500 outline-none text-black"
              placeholder="Search blogs"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  handleSearchSubmit();
                }
              }}
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowModal(false)} // Close modal
                className="text-red-500 font-bold"
              >
                X
              </button>
              <button
                onClick={handleSearchSubmit} // Submit search query
                className="bg-violet-500 text-white px-4 py-2 rounded-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 animate__animated animate__fadeInDown animate__slower">
          <Link
            to="/"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </Link>

          {!token || !isAuth ? (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Sign-Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/user-info"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Account Info
              </Link>
              <Link
                to="/user-blogs"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Your Blogs
              </Link>
              <Link
                to="/create-blog"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Create Blog
              </Link>
              <Link
                to="/login"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center gap-1"
                onClick={handleLogout}
              >
                {avatar && <img src={avatar} alt="Image" className="w-5 rounded-full" />}
                Logout
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="px-1 rounded ml-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

