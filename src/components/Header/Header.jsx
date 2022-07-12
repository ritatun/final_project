import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import store from "../../store/store";
import { logOut } from "../../store/action-creators";

import Logo from "../Logo/Logo";
import "./Header.css";

function NotLoggedUser() {
  return (
    <div className="auth-links">
      <Link to="/sign_in" className="sign-in">
        Войти
      </Link>
      <Link to="/sign_up" className="sign-up">
        Зарегистрироваться
      </Link>
    </div>
  );
}

function LoggedUser() {
  let navigate = useNavigate();
  function goHome() {
    navigate("/");
  }

  function handleSignOut() {
    store.dispatch(logOut());
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    goHome();
  }

  const localLogin = localStorage.getItem("login");

  return (
    <div className="authorized-user__nav">
      <div className="authorized-user__login">{localLogin}</div>
      <button className="button btn-logout" onClick={handleSignOut}>
        Выйти
      </button>
    </div>
  );
}

function Header(props) {
  return (
    <header className="container">
      <div className="header">
        <Link to="/">
          <Logo className="logo" color="#272727" />
        </Link>
        {props.state.islogged ? <LoggedUser /> : <NotLoggedUser />}
      </div>
    </header>
  );
}

function mapStateToProps(state) {
  return {
    state: {
      token: state.TOKEN,
      islogged: state.islogged,
    },
  };
}

export default connect(mapStateToProps)(Header);
