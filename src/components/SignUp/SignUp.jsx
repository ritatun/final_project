import React, { useState } from "react";
import "./SignUp.css";
import { connect } from "react-redux";

const SignUp = (props) => {
  const [authorize, setAuthorize] = useState({
    login: "",
    pass: "",
    passRepeat: "",
    firstName: "",
    lastName: "",
    clientId: "",
  });
  const [msg, setMsg] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  function handleInputChange(e, id) {
    setMsg("");
    let newState = authorize;
    newState[id] = e.target.value;
    setAuthorize(newState);
  }

  function handleSignUp(e) {
    e.preventDefault();
    if (!authorize.login) {
      setMsg("Адрес электронной почты не введен");
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
    if (!authorize.clientId) {
      setMsg("clientId не введен");
      return;
    }

    setMsg("");

    //ЗДЕСЬ ЗАПРОС НА РЕГИСТРАЦИЮ

    const body = {
      email: authorize.login,
      password: authorize.pass,
      clientId: authorize.clientId,
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
      <main className="sign_up">
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

          <label htmlFor="login">Введите адрес электронной почты*</label>
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

          <label htmlFor="clientId">Введите Client ID*</label>
          <input
            className="sign-up__clientId"
            type="text"
            id="clientId"
            required
            onChange={(e) => handleInputChange(e, "clientId")}
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
      </main>
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
