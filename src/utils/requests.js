import { saveOneOfficer, saveAllOfficer, saveAllCases, saveOneCase, saveApprovedOfficers, loadDone, saveMessage } from "../store/action-creators";
import store from "../store/store";

//-----------------------------------получить текущего сотрудника и сохранить в redux
export function getOneOfficer(id, token) {
  store.dispatch(loadDone(false));
  fetch(`https://sf-final-project.herokuapp.com/api/officers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      store.dispatch(loadDone(true));
      store.dispatch(saveOneOfficer(result.data));
    });
}

//-----------------------------------получить всех сотрудников и сохранить в redux
export function getAllOfficer(token){
  store.dispatch(loadDone(false));
  fetch("https://sf-final-project.herokuapp.com/api/officers/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          store.dispatch(loadDone(true));
          store.dispatch(saveAllOfficer(result.officers));
        }
        if (result.status !== "OK") {
          store.dispatch(saveMessage(result.message));
        }
      });
}

//-----------------------------------получить все сообщения об ошибке и сохранить в redux
export function getAllCases(token){
  store.dispatch(loadDone(false));
  fetch("https://sf-final-project.herokuapp.com/api/cases/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          store.dispatch(loadDone(true));
        }
        if (result.status === "OK") {
          store.dispatch(saveAllCases(result.data));
        } else {
          store.dispatch(saveMessage(result.message));
        }
      });
}

//-----------------------------------получить текущее сообщение об ошибке и сохранить в redux
export function getOneCase(id, token){
  store.dispatch(loadDone(false));

  fetch(`https://sf-final-project.herokuapp.com/api/cases/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      store.dispatch(loadDone(true));
      store.dispatch(saveOneCase(result.data));
    });
}

//-----------------------------------получить всех одобренных сотрудников и сохранить в redux
export function getApprovedOfficers(token){
  fetch(`https://sf-final-project.herokuapp.com/api/officers/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      let allReceivedofficers = [...result.officers].filter(
        (item) => item.approved
      );
      store.dispatch(saveApprovedOfficers(allReceivedofficers));
    });
}