import { createSlice } from "@reduxjs/toolkit";

const accounts = createSlice({
  name: "accounts",
  initialState: {
    accounts: [],
    account: {},
    total: 0,
    loading: false,
    monitors: [],
    students: [],
    accountsByRoles: [],
    mentorsByCourseId: [],
    studentsByCourseId: [],
    mentors: [],
    error: false,
  },
  reducers: {
    getAllAccounts: (state, isLoading) => {
      state.accounts = null;
      state.loading = isLoading;
    },
    getAllAccountsSuccess: (state, action) => {
      state.accounts = action.payload;
      state.loading = false;
    },
    getAllAccountsError: (state, isError) => {
      state.loading = false;
      state.error = isError;
    },
    getAllAccountsNumber: (state, isLoading) => {
      state.total = null;
      state.loading = isLoading;
    },
    getAllAccountsNumberSuccess: (state, action) => {
      state.total = action.payload;
      state.loading = false;
    },
    getAllAccountsNumberError: (state, action) => {
      state.total = action.payload;
      state.loading = false;
    },
    getAccountDetail: (state, action) => {
      state.account = action.payload;
      state.loading = true;
    },
    getAccountDetailSuccess: (state, action) => {
      state.account = action.payload;
      state.loading = false;
    },
    getAccountDetailError: (state, action) => {
      state.account = action.payload;
      state.loading = false;
    },
    getAccountsByRoleMonitor: (state) => {
      state.monitors = [];
      state.loading = true;
    },
    getAccountsByRoleMonitorSuccess: (state, action) => {
      state.monitors = action.payload;
      state.loading = false;
    },
    getAccountsByRoleMonitorError: (state, action) => {
      state.monitors = action.payload;
      state.loading = false;
    },
    getAccountsByRoleStudent: (state) => {
      state.students = [];
      state.loading = true;
    },
    getAccountsByRoleStudentSuccess: (state, action) => {
      state.students = action.payload;
      state.loading = false;
    },
    getAccountsByRoleStudentError: (state, action) => {
      state.students = action.payload;
      state.loading = false;
    },
    updateAccountSuccess: (state, account) => {
      state.accounts = state.accounts.map((i) =>
        i.email === account.payload.account.email ? account.payload.account : i
      );
      state.loading = false;
    },
    getAccountsByRoles: (state) => {
      state.accountsByRoles = [];
      state.loading = true;
    },
    getAccountsByRolesSuccess: (state, action) => {
      state.accountsByRoles = action.payload;
      state.loading = false;
    },
    getAccountsByRolesError: (state, action) => {
      state.accountsByRoles = action.payload;
      state.loading = false;
    },
    getMentorsByCourseId: (state) => {
      state.mentorsByCourseId = [];
      state.loading = true;
    },
    getMentorsByCourseIdSuccess: (state, action) => {
      state.mentorsByCourseId = action.payload;
      state.loading = false;
    },
    getMentorsByCourseIdError: (state, action) => {
      state.mentorsByCourseId = action.payload;
      state.loading = false;
    },
    getStudentsByCourseId: (state) => {
      state.studentsByCourseId = [];
      state.loading = true;
    },
    getStudentsByCourseIdSuccess: (state, action) => {
      state.studentsByCourseId = action.payload;
      state.loading = false;
    },
    getStudentsByCourseIdError: (state, action) => {
      state.studentsByCourseId = action.payload;
      state.loading = false;
    },
    getAccountsByRoleMentor: (state) => {
      state.mentors = [];
      state.loading = true;
    },
    getAccountsByRoleMentorSuccess: (state, action) => {
      state.mentors = action.payload;
      state.loading = false;
    },
    getAccountsByRoleMentorError: (state, action) => {
      state.mentors = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getAllAccounts,
  getAllAccountsSuccess,
  getAllAccountsError,
  getAllAccountsNumber,
  getAllAccountsNumberSuccess,
  getAllAccountsNumberError,
  getAccountDetail,
  getAccountDetailSuccess,
  getAccountDetailError,
  getAccountsByRoleMonitor,
  getAccountsByRoleMonitorSuccess,
  getAccountsByRoleMonitorError,
  getAccountsByRoleStudent,
  getAccountsByRoleStudentSuccess,
  getAccountsByRoleStudentError,
  updateAccountSuccess,
  getAccountsByRoles,
  getAccountsByRolesSuccess,
  getAccountsByRolesError,
  getMentorsByCourseId,
  getMentorsByCourseIdError,
  getMentorsByCourseIdSuccess,
  getStudentsByCourseId,
  getStudentsByCourseIdError,
  getStudentsByCourseIdSuccess,
  getAccountsByRoleMentor,
  getAccountsByRoleMentorSuccess,
  getAccountsByRoleMentorError,
} = accounts.actions;

export default accounts.reducer;
