import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/admin";

export async function findAccountByEmailAndRolePaginate(query) {
  return await axios.post("http://localhost:8080/admin/accounts", { query });
}
export async function updateAccount(email, account) {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const headers = {
    x_authorization: `${accessToken}`,
  };
  return await axios.post(
    "http://localhost:8080/admin/accounts/update",
    {
      email,
      account,
    },
    { headers }
  );
}

export async function getAccountDetailByEmail(email) {
  return await axios.post("http://localhost:8080/admin/accounts/detail", {
    email,
  });
}
export async function getStudentDetailByEmail(email) {
  return await axios.post("http://localhost:8080/admin/accounts/detail_student", {
    email,
  });
}

export async function getAccountsByRole(role) {
  return await axios.post("http://localhost:8080/admin/accounts/role", {
    role,
  });
}
export async function findMentorsByCourseId(course_id) {
  return await axios.post("http://localhost:8080/admin/mentors/course_id", {
    course_id,
  });
}
export async function findStudentsByCourseId(course_id) {
  return await axios.post("http://localhost:8080/admin/students/course_id", {
    course_id,
  });
}
export async function getAccountsByRoles(roles) {
  // console.log(roles);
  return await axios.post("http://localhost:8080/admin/accounts/roles", {
    roles,
  });
}
export async function updateAccountStatus(email) {
  // console.log(email);
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const headers = {
    x_authorization: `${accessToken}`,
  };

  return await axios.post(
    "http://localhost:8080/admin/accounts/update_status",
    {
      email,
    },
    { headers }
  );
}

export async function updateAccountPassword(email, password) {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const headers = {
    x_authorization: `${accessToken}`,
  };

  return await axios.post(
    "http://localhost:8080/admin/accounts/changePassword",
    {
      email,
      password,
    },
    { headers }
  );
}

export async function createAccount(account) {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const headers = {
    x_authorization: `${accessToken}`,
  };
  return await axios.post(
    "http://localhost:8080/admin/accounts/create",
    {
      account,
    },
    { headers }
  );
}
