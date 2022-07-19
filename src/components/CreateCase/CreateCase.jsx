import React from "react";
import "./CreateCase.css";
import Image from "../../img/green.jpg";
import { connect } from "react-redux";
import { getApprovedOfficers } from "../../utils/requests";
import store from "../../store/store";
import { createNewCase } from "../../store/action-creators";

const localtoken = localStorage.getItem("token");

const officerRequest = "https://sf-final-project.herokuapp.com/api/cases/";
const publicRequest =
  "https://sf-final-project.herokuapp.com/api/public/report";

class CreateCase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSent: false,
      URL: this.props.state.islogged ? officerRequest : publicRequest,
      errMsg: "",
    };
  }

  componentDidMount() {
    if (this.props.state.islogged) {
      getApprovedOfficers(localtoken);
    }
  }

  componentDidUpdate() {
    if (this.props.state.approvedOfficers.length) {
      return;
    }
    if (this.props.state.islogged) {
      getApprovedOfficers(localtoken);
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    const { islogged, newCase } = this.props.state;
    let response;

    if (!newCase.licenseNumber || !newCase.type || !newCase.name) {
      this.setState({ errMsg: "заполните обязательные поля" });
    } else {
      const dataOfficer = {
        licenseNumber: newCase.licenseNumber,
        ownerFullName: newCase.name,
        color: newCase.color ? newCase.color : null,
        date: newCase.date ? newCase.date : null,
        description: newCase.description ? newCase.description : null,
        type: newCase.type,
        officer: newCase.officer ? newCase.officer : null,
      };

      const dataPublic = {
        ...dataOfficer,
        clientId: this.props.state.clientId,
      };

      const headersPublic = {
        "Content-Type": "application/json",
      };

      const headersOfficer = {
        ...headersPublic,
        Authorization: `Bearer ${localtoken}`,
      };

      const emptyCase = {
        licenseNumber: null,
        ownerFullName: null,
        color: null,
        date: null,
        description: null,
        type: null,
        officer: null,
      };

      fetch(islogged ? officerRequest : publicRequest, {
        method: "POST",
        headers: islogged ? headersOfficer : headersPublic,
        body: JSON.stringify(islogged ? dataOfficer : dataPublic),
      })
        .then((res) => res.json())
        .then((result) => {
          response = result;
          if (response.status === "OK") {
            this.setState({ isSent: true });
            store.dispatch(createNewCase(emptyCase));
          } else {
            this.setState({ errMsg: response.message });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  handleChange = (e, inputId) => {
    this.setState({ errMsg: "" });

    let newCaseInfo = this.props.state.newCase;
    newCaseInfo[inputId] = e.target.value;
    store.dispatch(createNewCase(newCaseInfo));
  };

  render() {
    const { isSent } = this.state;
    const { islogged, approvedOfficers } = this.props.state;

    const msg = (
      <div className="case-msg">
        Ваше сообщение отправлено.
        <br /> Спасибо за предоставленную информацию
      </div>
    );

    const hideOfficer = (
      <>
        <label
          className="case-label label description-label"
          htmlFor="description"
        >
          Ответственный сотрудник:
        </label>
        {approvedOfficers ? (
          <select
            className="case-input officer-input"
            /* value={oneCase.officer} */
            onChange={(e) => this.handleChange(e, "officer")}
          >
            <option value="">Выберите сотрудника</option>
            {approvedOfficers.map((item) => {
              return (
                <option value={item._id} key={item._id}>
                  {item._id}
                </option>
              );
            })}
          </select>
        ) : (
          "Список сотрудников пуст"
        )}
      </>
    );

    const form = (
      <form className="createCase-left">
        <label
          className="case-label licenseNumber-label"
          htmlFor="licenseNumber"
        >
          Номер лицензии*
        </label>
        <input
          className="case-input licenseNumber-input"
          id="licenseNumber"
          //value={licenseNumber}
          onChange={(e) => this.handleChange(e, "licenseNumber")}
          placeholder="Введите номер лицензии"
          type="text"
          required
        />

        <label className="case-label type-label">Тип велосипеда*</label>
        <select
          //value={type}
          onChange={(e) => this.handleChange(e, "type")}
          className="case-input type-input"
          required
        >
          <option value="">Выберите тип велосипеда</option>
          <option value="general">обычный</option>
          <option value="sport">спорт</option>
        </select>

        <label className="case-label name-label" htmlFor="ownerFullName">
          ФИО арендатора велосипеда*
        </label>
        <input
          id="ownerFullName"
          placeholder="Введите ФИО"
          //value={name}
          onChange={(e) => this.handleChange(e, "name")}
          type="text"
          className="case-input name-input"
          required
        />

        <label className="case-label color-label" htmlFor="color">
          Цвет велосипеда
        </label>
        <input
          id="color"
          className="case-input color-input"
          placeholder="Введите цвет"
          //value={color}
          onChange={(e) => this.handleChange(e, "color")}
        />

        <label className="case-label date-label" htmlFor="date">
          Дата кражи
        </label>
        <input
          id="date"
          type="date"
          className="case-input date-input"
          //value={date}
          onChange={(e) => this.handleChange(e, "date")}
        />

        <label className="case-label description-label" htmlFor="description">
          Дополнительный комментарий
        </label>
        <input
          id="description"
          className="case-input description-input"
          placeholder="Введите дополнительный комментарий"
          //value={description}
          onChange={(e) => this.handleChange(e, "description")}
        />

        {islogged ? hideOfficer : ""}

        <p className="note-msg">* обязательное для заполнения поле</p>

        <button
          className="button button-createCase"
          type="submit"
          onClick={(e) => this.handleClick(e)}
        >
          ОТПРАВИТЬ СООБЩЕНИЕ О КРАЖЕ
        </button>
        <span className="case-errMsg err-msg">{this.state.errMsg}</span>
      </form>
    );

    const content = isSent ? msg : form;

    return (
      <main className="createCase-container">
        <h1 className="createCase-title">НОВОЕ СООБЩЕНИЕ О КРАЖЕ</h1>
        <div className="createCase-flexcontainer">
          <div>{content}</div>
          <div className="createCase-rigth">
            <img
              className={`case-img ${isSent ? "sended" : ""}`}
              src={Image}
              alt="bike"
            />
            <div
              className={`createCase-rigth-send ${isSent ? "show" : ""}`}
            ></div>
          </div>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    state: {
      newCase: state.newCase,
      approvedOfficers: state.approvedOfficers,
      islogged: state.islogged,
      clientId: state.clientId,
    },
  };
}

export default connect(mapStateToProps)(CreateCase);
