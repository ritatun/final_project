import React, { useState } from "react";
import "./CaseDetails.css";
import store from "../../store/store";
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import { getOneCase, getApprovedOfficers } from "../../utils/requests";
import { saveOneCase } from "../../store/action-creators";

const localtoken = localStorage.getItem("token");

const CaseDatails = (props) => {
  const [updateStatus, setUpdateStatus] = useState(false);
  const [updateErrMsg, setUpdateErrMsg] = useState("");
  const path = window.location.pathname;
  const id = path.slice(7);

  React.useEffect(() => {
    if (props.state.oneCase._id !== id) {
      getOneCase(id, localtoken);
    }

    getApprovedOfficers(localtoken);
  }, []);

  function handleChangeData(e, dataKey) {
    setUpdateErrMsg("");
    setUpdateStatus(false);
    let newOneCase = props.state.oneCase;
    if (dataKey === "status") {
      if (e.target.value !== "done") {
        newOneCase.resolution = "";
      }
    }
    newOneCase[dataKey] = e.target.value;
    store.dispatch(saveOneCase(newOneCase));
  }

  function handleChangeDate(e) {
    const regExp =
      /^(0[1-9]|[1-2][0-9]|3[0-1]).(0[1-9]|1[0-2]).((19[0-9]{2})|(2[0-9]{3}))$/;
    const flag = regExp.test(e.target.value);

    if (flag) {
      let dateArray = e.target.value.split(".");
      setUpdateErrMsg("");
      setUpdateStatus(false);
      let newOneCase = props.state.oneCase;
      newOneCase.date = `${dateArray[1]}.${dateArray[0]}.${dateArray[2]}`;
      store.dispatch(saveOneCase(newOneCase));
    }
  }

  function handleUpdateCase() {
    fetch(
      `https://sf-final-project.herokuapp.com/api/cases/${props.state.oneCase._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localtoken}`,
        },
        body: JSON.stringify(props.state.oneCase),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "OK") {
          setUpdateStatus(true);
        } else if (result.status === "ERR") {
          setUpdateErrMsg(result.message);
        }
        getOneCase(id, localtoken);
        getApprovedOfficers(localtoken);
      });
  }

  if (props.state.isLoadDone) {
    if (props.state.oneCase._id !== id) {
      return (
        <h1 className="not-founded-item">
          Сообщение о краже № {id} не найдено
        </h1>
      );
    } else {
      return (
        <section className="case-desc">
          <h1 className="case-desc_title">
            Сообщение о краже № {props.state.oneCase._id}
          </h1>
          <table className="case-desc_table">
            <tbody>
              <tr>
                <td>Имя арендатора:</td>
                <td>
                  <input
                    className="case_details-input"
                    value={props.state.oneCase.ownerFullName || ""}
                    onChange={(e) => handleChangeData(e, "ownerFullName")}
                  />
                </td>
              </tr>

              <tr>
                <td>Номер лицензии:</td>
                <td>
                  <input
                    className="case_details-input"
                    value={props.state.oneCase.licenseNumber || ""}
                    onChange={(e) => handleChangeData(e, "licenseNumber")}
                  />
                </td>
              </tr>

              <tr>
                <td>Цвет велосипеда:</td>
                <td>
                  <input
                    className="case_details-input"
                    value={props.state.oneCase.color || ""}
                    onChange={(e) => handleChangeData(e, "color")}
                  />
                </td>
              </tr>

              <tr>
                <td>Тип велосипеда:</td>
                <td>
                  <select
                    className="case_details-input"
                    value={props.state.oneCase.type || ""}
                    onChange={(e) => handleChangeData(e, "type")}
                  >
                    <option value={"general"}>обычный</option>
                    <option value={"sport"}>спорт</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>Статус сообщения о краже:</td>
                <td>
                  <select
                    className="case_details-input"
                    value={props.state.oneCase.status || ""}
                    onChange={(e) => handleChangeData(e, "status")}
                  >
                    <option value={"new"}>новое</option>
                    <option value={"in_progress"}>в работе</option>
                    <option value={"done"}>закрыто</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>Дата кражи:</td>
                <td>
                  <input
                    className="case_details-input case_details-date"
                    placeholder={
                      new Date(props.state.oneCase.date).toLocaleDateString() ||
                      ""
                    }
                    type="text"
                    onChange={handleChangeDate}
                  />
                </td>
              </tr>

              <tr>
                <td>Дата создания сообщения:</td>
                <td>
                  {props.state.oneCase.createdAt
                    ? new Date(props.state.oneCase.createdAt).toLocaleString()
                    : ""}
                </td>
              </tr>

              <tr>
                <td>Дата последнего обновления сообщения:</td>
                <td>
                  {props.state.oneCase.updatedAt
                    ? new Date(props.state.oneCase.updatedAt).toLocaleString()
                    : ""}
                </td>
              </tr>

              <tr>
                <td>Дополнительный комментарий:</td>
                <td>
                  <textarea
                    className="case_details-input"
                    value={props.state.oneCase.description || ""}
                    onChange={(e) => handleChangeData(e, "description")}
                  />
                </td>
              </tr>

              <tr>
                <td>Ответственный сотрудник:</td>
                <td>
                  {props.state.approvedOfficers ? (
                    <select
                      className="case_details-input"
                      value={props.state.oneCase.officer || ""}
                      onChange={(e) => handleChangeData(e, "officer")}
                    >
                      <option value=""></option>
                      {props.state.approvedOfficers.map((item) => {
                        return (
                          <option value={item._id} key={item._id}>
                            {item._id}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    "Список ответственных сотрудников пуст"
                  )}
                </td>
              </tr>

              <tr>
                <td>Завершающий комментарий:*</td>
                <td>
                  <input
                    className="case_details-input"
                    value={props.state.oneCase.resolution || ""}
                    onChange={(e) => handleChangeData(e, "resolution")}
                    disabled={props.state.oneCase.status !== "done"}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <p className="note-msg">
            *При выборе статуса сообщения «завершен» поле завершающего
            комментария является обязательным
          </p>
          <p className="err-msg">
            {props.state.oneCase.status === "done" &&
            !props.state.oneCase.resolution
              ? "Укажите завершающий комментарий"
              : ""}
          </p>
          <p className="err-msg">{updateErrMsg}</p>
          <button
            className="button btn-save-case"
            onClick={handleUpdateCase}
            disabled={
              props.state.oneCase.status === "done" &&
              !props.state.oneCase.resolution
                ? true
                : false
            }
          >
            Сохранить изменения
          </button>
          <span className="note-msg">
            {updateStatus ? "Данные сохранены" : ""}
          </span>
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
      oneCase: state.oneCase,
      approvedOfficers: state.approvedOfficers,
      isLoadDone: state.isLoadDone,
    },
  };
}

export default connect(mapStateToProps)(CaseDatails);
