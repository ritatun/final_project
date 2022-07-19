import React, { useState, useEffect } from "react";
import "./OfficerDatails.css";
import { connect } from "react-redux";
import Loader from "../Loader/Loader";
import { saveOneOfficer } from "../../store/action-creators";
import store from "../../store/store";
import { getOneOfficer } from "../../utils/requests";

const OfficerDatails = (props) => {
  const [updateStatus, setUpdateStatus] = useState(false);
  const [updateErrMsg, setUpdateErrMsg] = useState("");
  const [newPass, setNewPass] = useState("");

  const localtoken = localStorage.getItem("token");
  const path = window.location.pathname;
  const id = path.slice(10);

  useEffect(() => {
    getOneOfficer(id, localtoken);
  }, []);

  function handleChangeData(e, dataKey) {
    setUpdateErrMsg("");
    setUpdateStatus(false);

    if (dataKey === "password") {
      setNewPass(e.target.value);
    }
    let newOneOfficer = props.state.oneOfficer;
    newOneOfficer[dataKey] = e.target.value;
    store.dispatch(saveOneOfficer(newOneOfficer));
  }

  function handleChangeCheckbox(e) {
    setUpdateStatus(false);
    let newOneOfficer = props.state.oneOfficer;
    newOneOfficer.approved = e.target.checked;
    store.dispatch(saveOneOfficer(newOneOfficer));
  }

  function handleUpdateOfficer() {
    let oneOfficer = props.state.oneOfficer;

    if (newPass.length > 0 && (newPass.length < 3 || newPass.length > 12)) {
      setUpdateErrMsg("Пароль должен быть больше трех и меньше 12 знаков");
      return;
    }

    const newOfficerData = {
      firstName: oneOfficer.firstName,
      lastName: oneOfficer.lastName,
      approved: oneOfficer.approved,
    };

    const dataToSend = newPass
      ? { ...newOfficerData, password: newPass }
      : newOfficerData;

    fetch(
      `https://sf-final-project.herokuapp.com/api/officers/${oneOfficer._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localtoken}`,
        },
        body: JSON.stringify(dataToSend),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "OK") {
          setUpdateStatus(true);
        } else if (result.status === "ERR") {
          setUpdateErrMsg(result.message);
        }
        getOneOfficer(oneOfficer._id, localtoken);
      });
  }

  if (props.state.isLoadDone) {
    if (props.state.oneOfficer._id !== id) {
      return <h1 className="not-founded-item">Сотрудник № {id} не найден</h1>;
    } else {
      return (
        <section className="officer-desc">
          <h1 className="officer-desc_title">
            Сотрудник № {props.state.oneOfficer._id}
          </h1>
          <table className="officer-desc_table">
            <tbody>
              <tr>
                <td>Имя сотрудника:</td>
                <td>
                  <input
                    className="officer_details-input"
                    value={props.state.oneOfficer.firstName || ""}
                    onChange={(e) => handleChangeData(e, "firstName")}
                  />
                </td>
              </tr>

              <tr>
                <td>Фамилия сотрудника:</td>
                <td>
                  <input
                    className="officer_details-input"
                    value={props.state.oneOfficer.lastName || ""}
                    onChange={(e) => handleChangeData(e, "lastName")}
                  />
                </td>
              </tr>

              <tr>
                <td>Адрес электронной почты сотрудника:</td>
                <td>{props.state.oneOfficer.email}</td>
              </tr>

              <tr>
                <td>Пароль сотрудника:</td>
                <td>
                  <input
                    type="password"
                    className="officer_details-input"
                    //value={props.state.password}
                    placeholder="Введите новый пароль"
                    onChange={(e) => handleChangeData(e, "password")}
                  />
                </td>
              </tr>

              <tr>
                <td>Одобрен/не одобрен:</td>
                <td>
                  <input
                    className="officer_details-input"
                    type="checkbox"
                    checked={props.state.oneOfficer.approved}
                    onChange={(e) => handleChangeCheckbox(e)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button
            className="button btn-save-officer"
            onClick={handleUpdateOfficer}
          >
            Сохранить изменения
          </button>
          <p className="note-msg">{updateStatus ? "Данные сохранены" : ""}</p>
          <p className="err-msg">{updateErrMsg}</p>
        </section>
      );
    }
  } else {
    return (
      <section className="loader">
        <Loader />
      </section>
    );
  }
};

function mapStateToProps(state) {
  return {
    state: {
      oneOfficer: state.oneOfficer,
      isLoadDone: state.isLoadDone,
    },
  };
}

export default connect(mapStateToProps)(OfficerDatails);
