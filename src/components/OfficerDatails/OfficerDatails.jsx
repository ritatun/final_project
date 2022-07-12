import React, { useState, useEffect } from "react";
import "./OfficerDatails.css";
import { connect } from "react-redux";
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
    let newOneOfficer = props.state;
    newOneOfficer[dataKey] = e.target.value;
    store.dispatch(saveOneOfficer(newOneOfficer));
  }

  function handleChangeCheckbox(e) {
    setUpdateStatus(false);
    let newOneOfficer = props.state;
    newOneOfficer.approved = e.target.checked;
    store.dispatch(saveOneOfficer(newOneOfficer));
  }

  function handleUpdateOfficer() {
    let oneOfficer = props.state;

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

  if (props.state._id !== id) {
    return <h1 className="not-founded-item">Сотрудник № {id} не найден</h1>;
  } else {
    return (
      <section className="officer-desc">
        <h1 className="officer-desc_title">Сотрудник № {props.state._id}</h1>
        <table className="officer-desc_table">
          <tbody>
            <tr>
              <td>Имя сотрудника:</td>
              <td>
                <input
                  value={props.state.firstName}
                  onChange={(e) => handleChangeData(e, "firstName")}
                />
              </td>
            </tr>

            <tr>
              <td>Фамилия сотрудника:</td>
              <td>
                <input
                  value={props.state.lastName}
                  onChange={(e) => handleChangeData(e, "lastName")}
                />
              </td>
            </tr>

            <tr>
              <td>Адрес электронной почты сотрудника:</td>
              <td>{props.state.email}</td>
            </tr>

            <tr>
              <td>Пароль сотрудника:</td>
              <td>
                <input
                  type="password"
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
                  type="checkbox"
                  checked={props.state.approved}
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
};

function mapStateToProps(state) {
  return {
    state: state.oneOfficer,
  };
}

export default connect(mapStateToProps)(OfficerDatails);
