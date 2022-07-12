import React, { useState, useEffect } from "react";
import "./SignUp.css";
import { connect } from "react-redux";
import store from "../../store/store";

const SignUp = (props) => {
  const [authorize, setAuthorize] = useState({
    login: "",
    pass: "",
    passRepeat: "",
    firstName: "",
    lastName: "",
  });
  const [msg, setMsg] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  /*   useEffect(() => {}, [msg, isSuccess]); */

  function handleInputChange(e, id) {
    setMsg("");
    let newState = authorize;
    newState[id] = e.target.value;
    setAuthorize(newState);
    console.log(authorize);
  }

  function handleSignUp(e) {
    e.preventDefault();
    if (!authorize.login) {
      setMsg("Логин не введен");
      return;
    }
    if (!authorize.pass) {
      setMsg("Пароль не введен");
      return;
    }
    if (authorize.pass !== authorize.passRepeat) {
      setMsg("Пароли не совпадают");
      return;
    }

    setMsg("");

    //ЗДЕСЬ ЗАПРОС НА РЕГИСТРАЦИЮ

    const body = {
      email: authorize.login,
      password: authorize.pass,
      clientId: props.state,
      firstName: authorize.firstName,
      lastName: authorize.lastName,
    };

    fetch("https://sf-final-project.herokuapp.com/api/auth/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ERR") {
          setMsg(data.message);
        }
        if (data.status === "OK") {
          setSuccess(true);
        }
      });
  }

  if (!isSuccess) {
    return (
      <section className="sign_up">
        <h1 className="sign-up__headding">Зарегистрироваться</h1>
        <form className="sign-up__form">
          <label htmlFor="firstName">Введите имя</label>
          <input
            className="sign-up__firstName"
            type="text"
            id="firstName"
            onChange={(e) => handleInputChange(e, "firstName")}
          />

          <label htmlFor="lastName">Введите фамилию</label>
          <input
            className="sign-up__lastName"
            type="text"
            id="lastName"
            onChange={(e) => handleInputChange(e, "lastName")}
          />

          <label htmlFor="login">Введите логин*</label>
          <input
            className="sign-up__login"
            type="text"
            id="login"
            required
            onChange={(e) => handleInputChange(e, "login")}
          />

          <label htmlFor="pass">Введите пароль*</label>
          <input
            className="sign-up__pass"
            type="password"
            id="pass"
            required
            onChange={(e) => handleInputChange(e, "pass")}
          />

          <label htmlFor="pass-repeat">Повторите пароль*</label>
          <input
            className="sign-up__pass"
            type="password"
            id="passRepeat"
            onChange={(e) => handleInputChange(e, "passRepeat")}
          />
          <p>* обязательное для заполнения поле</p>
          <p className="err-msg">{msg}</p>
          <button
            className="button sign-up__btn"
            onClick={handleSignUp}
            type="submit"
          >
            ОК
          </button>
        </form>
      </section>
    );
  } else {
    return (
      <section className="sign_up">
        <div className="sign_up-result">
          {authorize.login}, спасибо за регистрацию!
          <br />А теперь, пожалуйста, войдите в Вашу учетную запись
        </div>
      </section>
    );
  }
};

function mapStateToProps(state) {
  return {
    state: state.clientId,
  };
}

export default connect(mapStateToProps)(SignUp);
