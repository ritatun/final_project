import React from "react";
import "./Footer.css";
import Github from "../../img/GitHub.png";

function Footer(props) {
  return (
    <footer className="footer-container">
      <div className="footer">
        <a className="footer-link" href="https://github.com/ritatun">
          <img className="github" src={Github} alt="github" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
