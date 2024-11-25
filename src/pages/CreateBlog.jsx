import React, { useState, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(""); // State to store file errors
  const location = useLocation();

  const refTitle = useRef(null);
  const refCategoryTitle = useRef(null);
  const refDescription = useRef(null);
  const refImgFile = useRef(null); // Renamed to refImgFile for clarity

  const token = localStorage.getItem("Blog-Token");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/" />;
  }

  // Validate file size before submitting
  const validateFileSize = (file) => {
    if (file && file.size > 500 * 1024) { // 500KB
      setFileError("File size exceeds the 500KB limit");
      return false;
    }
    setFileError(""); // Clear error if file size is valid
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !refTitle.current.value ||
      !refCategoryTitle.current.value ||
      !refDescription.current.value ||
      !refImgFile.current.files[0] // Check if a file is selected
    ) {
      return toast.error("All fields are required");
    }

    // Check the file size before submitting
    const file = refImgFile.current.files[0];
    if (!validateFileSize(file)) return;

    setLoading(true); // Set loading state to true before the request

    const formData = new FormData();
    formData.append("title", refTitle.current.value);
    formData.append("description", refDescription.current.value);
    formData.append("categoryTitle", refCategoryTitle.current.value);
    formData.append("imgUrl", file); // Add the selected file

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/create-blog`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      if (response?.data?.success) {
        refTitle.current.value = "";
        refDescription.current.value = "";
        refCategoryTitle.current.value = "";
        refImgFile.current.value = ""; // Clear the file input
        toast.success(response?.data?.message);
        navigate("/"); // Redirect to homepage after successful blog creation
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false); // Set loading state to false after the request
    }
  };

  return (
    <div className="flex justify-center items-center my-2 mx-2">
      <div className="w-full max-w-xl p-4 bg-slate-200 rounded-lg shadow-lg">
        <h2 className="text-xl dark:text-black md:text-2xl font-bold md:mb-6 text-center animate__animated animate__slow animate__pulse animate__infinite">
          {location?.pathname === "/create-blog" ? "Create A Blog" : ""}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              ref={refTitle}
              className="mt-1 block w-full px-3 py-2 border dark:text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="categoryTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Category Title
            </label>
            <input
              type="text"
              id="categoryTitle"
              name="categoryTitle"
              ref={refCategoryTitle}
              className="mt-1 dark:text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="imgUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Image Upload
            </label>
            <input
              type="file"
              id="imgUrl"
              name="image"
              ref={refImgFile} // Updated to refImgFile
              accept=".jpeg, .jpg, .png, image/jpeg, image/jpg, image/png"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black"
              required
            />
            {fileError && <div className="text-sm text-red-500 mt-1">{fileError}</div>}
            <div className="text-sm text-gray-500 mt-1">
              Max file size: 500KB. Supported formats: .jpeg, .jpg, .png.
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              type="text"
              id="description"
              name="description"
              rows={5}
              ref={refDescription}
              className="mt-1 dark:text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              style={{ resize: "none" }}
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-400 hover:text-black"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              disabled={loading} // Disable the button if loading is true
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;


