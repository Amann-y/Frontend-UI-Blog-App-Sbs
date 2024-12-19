import React from "react";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";

const SavedBlogCard = ({ blogData }) => {
  const { imgUrl, categoryTitle, title, description } = blogData;
  const navigate = useNavigate();
  return (
    <Tilt>
      <div
        className="h-96 cursor-pointer relative rounded-lg overflow-hidden flex flex-col shadow-[3px_3px_10px_rgba(0,0,0,0.5)] border border-white/20 w-full md:w-96"
        onClick={() => navigate("/single-blog", { state: blogData })}
      >
        <img
          src={`data:image/jpeg;base64,${imgUrl}`}
          alt={categoryTitle}
          className="h-full w-full object-cover absolute inset-0 z-0"
        />
        <div
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(to top, #000 transparent)" }}
        ></div>
        <h2 className="text-sm z-10 relative mt-auto mx-auto">{title}</h2>
        <p className="text-sm z-10 relative mx-auto mb-1">{description}</p>
      </div>
    </Tilt>
  );
};

export default SavedBlogCard;
