import React from "react";
import { FaRegEye } from "react-icons/fa";
import { convertUTCToIST } from "../../utils/convertUTCToIST";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";

const BlogCard = ({
  blogData,
  trimDescription,
  isMore,
  setExpandedItems,
  index,
}) => {
  const {
    imgUrl,
    categoryTitle,
    description,
    title,
    nameOfCreator,
    createdAt,
    likes,
    views,
  } = blogData;

  const navigate = useNavigate();

  const toggleMore = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const istDate = convertUTCToIST(createdAt);

  return (
    <Tilt perspective={1500}>
      <div
        className="shadow-lg mx-1 rounded border-2 pb-2 dark:hover:bg-slate-500 hover:bg-zinc-300 cursor-pointer flex flex-col justify-between gap-2"
        onClick={() => navigate("/single-blog", { state: blogData })}
      >
        <img
          src={`data:image/jpeg;base64,${imgUrl}`}
          alt={categoryTitle}
          className="w-full max-h-48 sm:max-h-32 md:max-h-48 lg:max-h-64 xl:max-h-72 object-cover object-top rounded hover:scale-95 transition-all ease-in-out duration-200"
        />
        <h1 className="px-1 text-center font-semibold">{title}</h1>

        <div className="px-2">
          {description.length > 120 ? (
            <div>
              <span className="font-thin">
                {isMore ? description : trimDescription}
                <button
                  onClick={() => toggleMore(index)}
                  className="font-semibold"
                >
                  {isMore ? " ...less" : " more"}
                </button>
              </span>
            </div>
          ) : (
            <span className="font-thin">{description}</span>
          )}
        </div>

        <div className="px-2">
          <h2>
            Created By: <span className="font-semibold">{nameOfCreator}</span>
          </h2>
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <p>{istDate}</p>
            {likes?.length > 0 && (
              <p>
                {likes.length} {likes.length > 1 ? "Likes" : "Like"}
              </p>
            )}
            <div className="flex items-center gap-1 flex-wrap">
              <FaRegEye />
              <p className="text-black dark:text-white">{views}</p>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default BlogCard;
