import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { connect } from "react-redux";
import store from "../../store/store";
import { logIn, setCurrentUser } from "../../store/action-creators";

const SignIn = (props) => {
  const [authorize, setAuthorize] = useState({
    login: "",
    pass: "",
  });

  let navigate = useNavigate();

  const [msg, setMsg] = useState("");

  function handleInputChange(e, id) {
    setMsg("");
    let newState = authorize;
    newState[id] = e.target.value;
    setAuthorize(newState);
  }

  function goHome() {
    navigate("/");
  }

  function handleSignIn(e) {
    e.preventDefault();
    const body = {
      email: authorize.login,
      password: authorize.pass,
    };

    fetch("https://sf-final-project.herokuapp.com/api/auth/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "OK") {
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("login", authorize.login);
          store.dispatch(logIn());
          goHome();
        } else {
          setMsg(result.message);
        }
      });
  }

  return (
    <section className="sign_in">
      <h1 className="sign-in__headding">Войти</h1>
      <form className="sign-in__form">
        <label htmlFor="login">Введите логин</label>
        <input
          className="sign-in__login"
          type="text"
          id="login"
          onChange={(e) => handleInputChange(e, "login")}
        />
        <label htmlFor="pass">Введите пароль</label>
        <input
          className="sign-in__pass"
          type="password"
          id="pass"
          onChange={(e) => handleInputChange(e, "pass")}
        />
        <p className="err-msg">{msg}</p>
        <button
          className="button sign-in__btn"
          type="submit"
          onClick={handleSignIn}
        >
          ОК
        </button>
      </form>
    </section>
  );
};

function mapStateToProps(state) {
  return {
    state: state.islogged,
  };
}

export default connect(mapStateToProps)(SignIn);
