import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { storeToken } from "../utils/storeDataInLocalStorage";
import { Navigate, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/useUserContext";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null)
  const fName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const captchaRef = useRef(null);

  const token = localStorage.getItem("Blog-Token");
  const isAuth = localStorage.getItem("isAuth")

  const { saveUserData } = useGlobalContext();

  const navigate = useNavigate()

  if (token && isAuth) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fName.current.value ||
      !email.current.value ||
      !password.current.value
    ) {
      return toast.error("All fields are required");
    }

    if(!recaptchaValue){
      return toast.error("Please tick reCaptcha");
    }

    setLoading(true); // Set loading state to true before the request

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register-user`,
        {
          fullName: fName.current.value,
          email: email.current.value,
          password: password.current.value,
          recaptchaValue : recaptchaValue
        }
      );

      if (response.data.success) {
        saveUserData(
          response?.data?.token || null,
          response?.data?.userName,
          response?.data?.userEmail,
          response?.data?.userId
        );
        const output = storeToken(response?.data?.token || null);
      
        fName.current.value = "";
        email.current.value = "";
        password.current.value = "";
        captchaRef.current.reset()
        setRecaptchaValue(null);
        toast.success(response?.data?.message);
        navigate("/account/verify-email")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      captchaRef.current.reset()
      setRecaptchaValue(null);
    } finally {
      setLoading(false); // Set loading state to false after the request
    }
  };

  const recaptchaHandler = (value)=>{
    setRecaptchaValue(value)
  }

  return (
    <div className="flex justify-center items-center my-2 mx-2">
      <div className="w-full max-w-md p-4 bg-slate-300 rounded-lg shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold md:mb-6 text-center animate-bounce dark:text-black">
          Register Form
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              ref={fName}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              ref={email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              ref={password}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black"
              required
            />
          </div>

          <div>
            <ReCAPTCHA sitekey={import.meta.env.VITE_SITE_KEY} onChange={recaptchaHandler} ref={captchaRef}/>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-300 hover:text-black"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              disabled={loading} // Disable the button if loading is true
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
