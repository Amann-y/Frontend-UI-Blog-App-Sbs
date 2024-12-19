import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: location?.state?.title || "",
    categoryTitle: location?.state?.categoryTitle || "",
    description: location?.state?.description || "",
    imgUrl: location?.state?.imgUrl || "",
  });
  const [imgFile, setImgFile] = useState(null); // Track the selected file
  const token = localStorage.getItem("Blog-Token");
  const navigate = useNavigate();

  // Redirect if location state is invalid
  if (!location?.state || !token) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if the image size is less than 500KB
      if (file.size > 500 * 1024) {
        toast.error("Image size must be less than 500KB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, imgUrl: reader.result });
        setImgFile(file); // Save the file for validation
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if an image is selected
    if (!data.imgUrl && !imgFile) {
      return toast.error("Please select an image.");
    }

    if (!data.title || !data.categoryTitle || !data.description) {
      return toast.error("All fields are required.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      // If there's a new image selected, append it to the form data
      if (imgFile) {
        formData.append("imgUrl", imgFile); // Assuming the API expects the file under "image"
      }
      formData.append("title", data.title);
      formData.append("categoryTitle", data.categoryTitle);
      formData.append("description", data.description);

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/user-blog/${location?.state?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Use form data for file uploads
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-2 mx-2">
      <div className="w-full max-w-xl p-4 bg-slate-300 rounded-lg mb-2 shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold md:mb-6 text-center animate__animated animate__slow animate__pulse animate__infinite dark:text-black">
          {location?.pathname === "/update-blog" ? "Update A Blog" : ""}
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
              value={data.title}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black"
              onChange={handleChange}
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
              value={data.categoryTitle}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black"
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="imgUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>

            {/* Display the image preview if imgUrl exists */}
            {data.imgUrl ? (
              <div className="mb-2 md:w-40">
                <img
                  src={data.imgUrl}
                  alt=""
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            ) : (
              <p className="text-gray-500">No image selected</p>
            )}

            {/* File input to upload a new image */}
            <input
              type="file"
              accept=".jpeg, .jpg, .png, image/jpeg, image/jpg, image/png"
              onChange={handleImageChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={data.description}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black"
              onChange={handleChange}
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
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;



