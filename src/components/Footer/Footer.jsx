import React from "react";
import "./Footer.css";
import Github from "../../img/GitHub.png";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer">
        <a href="https://github.com/ritatun">
          <img className="github" src={Github} alt="github" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
