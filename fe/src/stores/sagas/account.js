import { put, call, takeLatest } from "redux-saga/effects";
import {
  getAllAccountsSuccess,
  getAllAccountsError,
  getAllAccountsNumberSuccess,
  getAllAccountsNumberError,
  getAccountDetail,
  getAccountDetailSuccess,
  getAccountDetailError,
  getAccountsByRoleMonitorSuccess,
  getAccountsByRoleMonitorError,
  getAccountsByRoleStudentSuccess,
  getAccountsByRoleStudentError,
  getAllAccounts,
  getAllAccountsNumber,
  updateAccountSuccess,
  getAccountsByRoleMentorError,
  getAccountsByRoleMentorSuccess,
  getAccountsByRolesSuccess,
  getAccountsByRolesError,
  getMentorsByCourseIdError,
  getMentorsByCourseIdSuccess,
  getStudentsByCourseIdError,
  getStudentsByCourseIdSuccess,
} from "../slices/account";
import {
  findAccountByEmailAndRolePaginate,
  getAccountDetailByEmail,
  getStudentDetailByEmail,
  getAccountsByRole,
  getAccountsByRoles,
  findMentorsByCourseId,
  findStudentsByCourseId,
} from "../../services/account.service";

import {
  GET_ALL_ACCOUNTS,
  GET_ACCOUNTS_BY_ROLE_MONITOR,
  GET_ACCOUNT_DETAIL,
  GET_ALL_ACCOUNTS_NUMBER,
  GET_ACCOUNTS_BY_ROLE_STUDENT,
  UPDATE_ACCOUNT_STATUS,
  GET_ACCOUNTS_BY_ROLES,
  GET_MENTORS_BY_COURSE_ID,
  GET_STUDENTS_BY_COURSE_ID,
  GET_ACCOUNTS_BY_ROLE_MENTOR,
  GET_STUDENT_DETAIL,
} from "../types/account";

export function* onLoadAccountsStartAsync(query) {
  try {
    yield put(getAllAccounts({ isLoading: true }));
    const response = yield call(
      findAccountByEmailAndRolePaginate,
      query.payload
    );
    // console.log(query.payload);
    if (response.status === 200) {
      yield put(getAllAccountsSuccess(response.data.accounts));
      // console.log(response.data);
    }
  } catch (error) {
    yield put(getAllAccountsError({ isError: true }));
    console.log("error");
  }
}

export function* onLoadAccountsNumberStartAsync(query) {
  try {
    yield put(getAllAccountsNumber({ isLoading: true }));
    const response = yield call(
      findAccountByEmailAndRolePaginate,
      query.payload
    );
    if (response.status === 200) {
      yield put(getAllAccountsNumberSuccess(response.data.total));
    }
  } catch (error) {
    yield put(getAllAccountsNumberError({ isError: true }));
    console.log("error");
  }
}

export function* onLoadAccountDetailStartAsync(email) {
  try {
    const response = yield call(getAccountDetailByEmail, email.payload);
    if (response.status === 200) {
      yield put(getAccountDetailSuccess(response.data));
    }
  } catch (error) {
    yield put(getAccountDetailError(error));
    console.log("error");
  }
}
export function* onLoadStudentDetailStartAsync(email) {
  yield put(getAccountDetail());
  try {
    const response = yield call(getStudentDetailByEmail, email.payload);
    if (response.status === 200) {
      yield put(getAccountDetailSuccess(response.data.account));
    }
  } catch (error) {
    yield put(getAccountDetailError(error));
    console.log("error");
  }
}

export function* onLoadAccountsByRoleMonitorStartAsync(role) {
  try {
    const response = yield call(getAccountsByRole, role.payload);
    if (response.status === 200) {
      yield put(getAccountsByRoleMonitorSuccess(response.data.accounts));
    }
  } catch (error) {
    yield put(getAccountsByRoleMonitorError(error));
    console.log("error");
  }
}

export function* onLoadAccountsByRoleStudentStartAsync(role) {
  try {
    const response = yield call(getAccountsByRole, role.payload);
    if (response.status === 200) {
      yield put(getAccountsByRoleStudentSuccess(response.data.accounts));
    }
  } catch (error) {
    yield put(getAccountsByRoleStudentError(error));
    console.log("error");
  }
}

export function* onLoadAccountsByRoleMentorStartAsync(role) {
  try {
    const response = yield call(getAccountsByRole, role.payload);
    if (response.status === 200) {
      yield put(getAccountsByRoleMentorSuccess(response.data.accounts));
    }
  } catch (error) {
    yield put(getAccountsByRoleMentorError(error));
    console.log("error");
  }
}

export function* onLoadAccountsByRolesStartAsync(roles) {
  try {
    const response = yield call(getAccountsByRoles, roles.payload);
    if (response.status === 200) {
      yield put(getAccountsByRolesSuccess(response.data.accounts));
      // console.log(response.data);
    }
  } catch (error) {
    yield put(getAccountsByRolesError(error));
    console.log("error");
  }
}

export function* onLoadMentorsByCourseIdStartAsync(action) {
  try {
    const response = yield call(findMentorsByCourseId, action.payload);
    if (response.status === 200) {
      yield put(getMentorsByCourseIdSuccess(response.data.accounts));
      console.log("mentors: ", response.data);
    }
  } catch (error) {
    yield put(getMentorsByCourseIdError(error));
    console.log("error");
  }
}

export function* onLoadStudentsByCourseIdStartAsync(action) {
  try {
    const response = yield call(findStudentsByCourseId, action.payload);
    if (response.status === 200) {
      yield put(getStudentsByCourseIdSuccess(response.data.accounts));
      console.log("students: ", response.data);
    }
  } catch (error) {
    yield put(getStudentsByCourseIdError(error));
    console.log("error");
  }
}

export function* onUpdateAccountStatus(payload) {
  yield put(updateAccountSuccess({ account: payload.account }));
  // console.log(payload.account);
}

export function* watchAccountsAsync() {
  try {
    yield takeLatest(GET_ALL_ACCOUNTS_NUMBER, onLoadAccountsNumberStartAsync);
    yield takeLatest(GET_ALL_ACCOUNTS, onLoadAccountsStartAsync);
    yield takeLatest(GET_ACCOUNT_DETAIL, onLoadAccountDetailStartAsync);
    yield takeLatest(
      GET_ACCOUNTS_BY_ROLE_MONITOR,
      onLoadAccountsByRoleMonitorStartAsync
    );
    yield takeLatest(
      GET_ACCOUNTS_BY_ROLE_STUDENT,
      onLoadAccountsByRoleStudentStartAsync
    );
    yield takeLatest(
      GET_MENTORS_BY_COURSE_ID,
      onLoadMentorsByCourseIdStartAsync
    );
    yield takeLatest(
      GET_STUDENTS_BY_COURSE_ID,
      onLoadStudentsByCourseIdStartAsync
    );
    yield takeLatest(GET_ACCOUNTS_BY_ROLES, onLoadAccountsByRolesStartAsync);
    yield takeLatest(UPDATE_ACCOUNT_STATUS, onUpdateAccountStatus);
    yield takeLatest(
      GET_ACCOUNTS_BY_ROLE_MENTOR,
      onLoadAccountsByRoleMentorStartAsync
    );
    yield takeLatest(GET_STUDENT_DETAIL, onLoadStudentDetailStartAsync);
  } catch (error) {
    console.log("error");
  }
}
