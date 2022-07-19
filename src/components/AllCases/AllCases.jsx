import React from "react";
import "./AllCases.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getAllCases } from "../../utils/requests";
import Loader from "../Loader/Loader";
import { getOneCase } from "../../utils/requests";

const AllCases = (props) => {
  const localToken = localStorage.getItem("token");

  React.useEffect(() => {
    getAllCases(localToken);
  }, []);

  function handleDelCase(idDel) {
    fetch(`https://sf-final-project.herokuapp.com/api/cases/${idDel}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localToken}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "OK") {
          getAllCases(localToken);
        }
      });
  }

  function handleLinkClick(caseId) {
    const localtoken = localStorage.getItem("token");
    getOneCase(caseId, localtoken);
  }

  function showStatus(status) {
    if (status === "new") {
      return "новое";
    } else if (status === "in_progress") {
      return "в работе";
    } else if (status === "done") {
      return "закрыто";
    }
  }

  if (props.state.isLoadDone) {
    if (props.state.islogged) {
      return (
        <main className="all-cases">
          <h1 className="headding">СООБЩЕНИЯ О КРАЖАХ ВЕЛОСИПЕДОВ</h1>
          <table className="table table-case">
            <thead>
              <tr className="table-row">
                <th className="table-row-license">Номер лицензии</th>
                <th>ФИО арендатора</th>
                <th className="small-screen">Цвет велосипеда</th>
                <th className="small-screen">Тип велосипеда</th>
                <th className="big-screen">Дополнительный комментарий</th>
                <th className="small-screen">
                  Дата <br /> кражи
                </th>
                <th className="big-screen">Ответственный сотрудник</th>
                <th className="big-screen">Дата создания сообщения</th>
                <th className="big-screen">
                  Дата последнего обновления сообщения
                </th>
                <th className="small-screen">Статус</th>
                <th className="big-screen">Завершающий комментарий</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {props.state.allCases.map((item) => {
                return (
                  <tr className="table-row" key={item._id}>
                    <td className="table-row-license">{item.licenseNumber}</td>
                    <td>{item.ownerFullName}</td>
                    <td className="small-screen">{item.color}</td>
                    <td className="small-screen">
                      {item.type === "general" ? "обычный" : "спорт"}
                    </td>
                    <td className="big-screen">{item.description}</td>
                    <td className="small-screen">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="big-screen">{item.officer}</td>
                    <td className="big-screen">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : ""}
                    </td>
                    <td className="big-screen">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString()
                        : ""}
                    </td>
                    <td className="small-screen">{showStatus(item.status)}</td>
                    <td className="big-screen">{item.resolution}</td>
                    <td className="case-btns">
                      <Link
                        className="button table-btn"
                        to={`/cases/${item._id}`}
                        onClick={() => handleLinkClick(item._id)} // проба
                      >
                        Подробнее
                      </Link>
                      <button
                        className="button table-btn"
                        onClick={() => handleDelCase(item._id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      );
    } else {
      return (
        <section className="note-msg noAutorization">
          {props.state.message}
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
      allCases: state.allCases,
      isLoadDone: state.isLoadDone,
      islogged: state.islogged,
      message: state.message,
    },
  };
}

export default connect(mapStateToProps)(AllCases);
