import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Main from './components/Main/Main.jsx';
import CreateCase from './components/CreateCase/CreateCase.jsx';
import AllCases from './components/AllCases/AllCases';
import AllOfficers from './components/AllOfficers/AllOfficers';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import CaseDatails from "./components/CaseDetails/CaseDetails.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import OfficerDatails from "./components/OfficerDatails/OfficerDatails.jsx";
import store from './store/store';
import { logIn, logOut } from './store/action-creators';
import { connect } from "react-redux";

function App(props) {


useEffect(() => {

  let localToken = localStorage.getItem("token");
  if (localToken) {
    //запрос на проверку действительности токена

    fetch(`https://sf-final-project.herokuapp.com/api/auth/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localToken}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "OK") {
          store.dispatch(logIn());
          console.log("токен действителен")
        } else {
          store.dispatch(logOut()); // подтереть флаг залогированности пользователя
        }
      });
  } else {
    store.dispatch(logOut()); // подтереть флаг залогированности пользователя
  }
}, [])

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="" element={<Main islogged={props.state.islogged} />}></Route>
        <Route path="/createcase" element={<CreateCase />}></Route>
        <Route path="/cases" element={<AllCases />}></Route>
        <Route path="/officers" element={<AllOfficers />}></Route>
        <Route path="/sign_in" element={<SignIn />}></Route>
        <Route path="/sign_up" element={<SignUp />}></Route>
        <Route
            path="/cases/:id"
            element={
              <CaseDatails />
            }
          ></Route>
        <Route
            path="/officers/:id"
            element={
              <OfficerDatails />
            }
          ></Route>
        <Route path="*" element={<NotFound />} />

      </Routes>
      {props.state.isLoadDone ? <Footer /> : null}
    </div>
  );
}


function mapStateToProps(state) {
  return {
    state: state,
  };
}

export default connect(mapStateToProps )(App);
