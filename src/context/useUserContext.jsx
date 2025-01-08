import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext({
  saveUserData: () => {},
  removeUserData: () => {},
  userId: null,
  userEmail: null,
  userName: null,
  theme: 'light',
  toggleTheme: () => {},
  avatar: null,
});

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("Blog-Token") || null
  );
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [uniqueUserName, setUniqueUserName] = useState(null);
  const [saveBlogs, setSaveBlogs] = useState([])
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Effect to fetch user data if token exists
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logged-user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
         
          const name = (response?.data?.user?.fullName.includes(" ")) ? response?.data?.user?.fullName : response?.data?.user?.fullName[0]

          if(response?.data?.user?.fullName){
            const encodedName = encodeURIComponent(name);
            const output = await axios.get(`https://ui-avatars.com/api/?uppercase=false&name=${encodedName}&color=ff0000&bold=true&size=150&background=random`);
           
            setAvatar(output.request.responseURL);
          }
          
          setUserEmail(response?.data?.user?.email || null);
          setUserName(response?.data?.user?.fullName || null);
          setUserId(response?.data?.user?._id || null);
          setUniqueUserName(response?.data?.user?.userName || null)
          setSaveBlogs(response?.data?.user?.saveBlogs || [])
        } catch (error) {
          // toast.error("Failed to fetch user data");
        }
      } else {
        setUserEmail(null);
        setUserName(null);
        setUserId(null);
        setUniqueUserName(null)
      }
    };

    fetchUserData();
  }, [token]); // Fetch user data when token changes

  useEffect(() => {
    // Update the theme in the HTML class
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const saveUserData = (token="", username, useremail, userid, uniqueUserName) => {
    setToken(token);
    setUserEmail(useremail);
    setUserName(username);
    setUserId(userid);
    setUniqueUserName(uniqueUserName)
    localStorage.setItem("Blog-Token", token); // Store token in localStorage
  };

  const removeUserData = () => {
    setToken(null);
    setUserEmail(null);
    setUserName(null);
    setUserId(null);
    setUniqueUserName(null)
    localStorage.removeItem("Blog-Token");
    localStorage.removeItem("isAuth"); 
  };

  return (
    <AppContext.Provider
      value={{ saveUserData, removeUserData,saveBlogs, userId, userEmail, userName, theme, toggleTheme,avatar,uniqueUserName}}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
