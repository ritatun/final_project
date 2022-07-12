import { ACTION } from "./actionTypes";

export function saveAllCases(value) {
    return {
        type: ACTION.ALL_CASES,
        payload: value
    }
}

export function saveAllOfficer(value) {
    return {
        type: ACTION.ALL_OFFICERS,
        payload: value
    }
}

export function saveApprovedOfficers(value) {
    return {
        type: ACTION.SAVE_APPROVED_OFFICERS,
        payload: value
    }
}

export function saveOneCase(value) {
    return {
        type: ACTION.ONE_CASE,
        payload: value
    }
}

export function loadDone(value) {
    return {
        type: ACTION.LOAD_DONE,
        payload: value
    }
}

export function saveOneOfficer(value) {
    return {
        type: ACTION.ONE_OFFICER,
        payload: value
    }
}

export function logIn() {
    return {
        type: ACTION.LOGIN,
    }
}

export function logOut() {
    return {
        type: ACTION.LOGOUT,
    }
}

export function createNewCase(value) {
    return {
        type: ACTION.NEW_CASE,
        payload: value
    }
}

export function saveMessage(value) {
    return {
        type: ACTION.MSG,
        payload: value
    }
}

