import React from "react";
import "./AllOfficers.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getAllOfficer } from "../../utils/requests";
import Loader from "../Loader/Loader";

const AllOfficers = (props) => {
  const localToken = localStorage.getItem("token");

  React.useEffect(() => {
    getAllOfficer(localToken);
  }, []);

  function handleDelOfficer(idDel) {
    fetch(`https://sf-final-project.herokuapp.com/api/officers/${idDel}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localToken}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "OK") {
          getAllOfficer(localToken);
        }
      });
  }

  if (props.state.isLoadDone) {
    if (props.state.islogged) {
      return (
        <main className="all-officers">
          <div className="headding">ОТВЕТСТВЕННЫЕ СОТРУДНИКИ</div>
          <table className="table table-officers">
            <thead className="table-head">
              <tr className="table-row">
                <th>Имя сотрудника</th>
                <th>Фамилия сотрудника</th>
                <th className="small-screen-officer">
                  E-mail адрес сотрудника
                </th>
                <th className="small-screen-officer">Статус сотрудника</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {props.state.allOfficers.map((item) => {
                return (
                  <tr className="table-row" key={item._id}>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td className="small-screen-officer">{item.email}</td>
                    <td className="small-screen-officer">
                      {item.approved ? "одобрен" : "не одобрен"}
                    </td>
                    <td className="officer-btns">
                      <Link
                        className="button table-btn"
                        to={`/officers/${item._id}`}
                      >
                        Подробнее
                      </Link>
                      <button
                        className="button table-btn"
                        onClick={() => handleDelOfficer(item._id)}
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
      allOfficers: state.allOfficers,
      isLoadDone: state.isLoadDone,
      islogged: state.islogged,
      message: state.message,
    },
  };
}

export default connect(mapStateToProps)(AllOfficers);
