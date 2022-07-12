import React from "react";
import "./NotFound.css";
import Img from "../../img/404.jpg";

const NotFound = () => {
  return (
    <div>
      <img className="not-found_img" src={Img} alt="page not found" />
    </div>
  );
};

export default NotFound;
