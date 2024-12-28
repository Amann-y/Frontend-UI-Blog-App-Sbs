import React from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import BlogCard from "../components/blogCard/BlogCard";

const SearchBlogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("search");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (query) {
      async function fetchSearchBlogs() {
        try {
          const res = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/v1/blog/search-blogs?search=${query}`
          );
          setBlogs(res?.data?.blogs);
        } catch (error) {
          setBlogs([]);
          // toast.error(error?.response?.data?.message);
        }
      }
      fetchSearchBlogs();
    }
  }, [query]);
  return (
    <div className="container py-1 mx-auto">
      <div className="px-1 my-1 md:text-xl md:px-10 text-gray-400">
        Results for <span className="font-bold text-gray-200">{query}</span>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 py-1">
        {blogs.length > 0 ? (
          blogs.map((ele, ind) => {
            return <BlogCard key={ind} blogData={ele} />;
          })
        ) : (
          <div className="px-1 md:px-10">No Result Found</div>
        )}
      </div>
    </div>
  );
};

export default SearchBlogs;
