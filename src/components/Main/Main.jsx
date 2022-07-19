import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import Parking from "../../img/parking.jpg";
import Boy from "../../img/boy.jpg";
import Wheels from "../../img/wheels.jpg";
import Parking2 from "../../img/parking2.jpg";
import store from "../../store/store";
import { loadDone } from "../../store/action-creators";

function NotLoggedUser() {
  return (
    <div className="description">
      <h1 className="description-title">Украли велосипед? </h1>
      <p className="description-text">
        Жаль это слышать, но тем не менее добро пожаловать в сервис, с помощью
        которого Вы можете сообщить о случае кражи арендованного у нас
        велосипеда.
        <br />
        <br />
        Для этого необходимо заполнить небольшую форму, предоставив нам
        информацию о номере лицензии, типе велосипеда и пр.
      </p>
      <Link to="/createcase" className="button createCase createCase-public">
        cообщить о краже
      </Link>
    </div>
  );
}

function LoggedUser() {
  return (
    <section className="main-officer">
      <Link to="/createcase" className="button createCase">
        Сообщить о краже
      </Link>
      <Link to="/allcases" className="button createCase">
        Показать все сообщения о краже
      </Link>
      <Link to="/allofficers" className="button createCase">
        Показать всех сотрудников
      </Link>
    </section>
  );
}

function Main({ islogged }) {
  useEffect(() => {
    store.dispatch(loadDone(true));
  }, []);

  useEffect(() => {
    const slides = document.querySelectorAll(".slide");
    let i = 0;
    const sliderId = setInterval(() => {
      i = i === 4 ? 0 : i;
      slides.forEach((slideItem) => slideItem.classList.remove("active"));
      slides.item(i).classList.add("active");
      i++;
    }, 3000);

    return () => clearInterval(sliderId);
  });

  return (
    <main className="main-container">
      <div className="main">
        {islogged ? <LoggedUser /> : <NotLoggedUser />}
        <div className="slider">
          <img src={Parking} className="slide active" alt="bike parking"></img>
          <img src={Boy} className="slide" alt="cyclist"></img>
          <img src={Wheels} className="slide" alt="wheels"></img>
          <img src={Parking2} className="slide" alt="bike parking"></img>
        </div>
      </div>
    </main>
  );
}

export default Main;
