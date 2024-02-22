const userModel = require("../dal/account");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

exports.findAccountByEmailAndRolePaginate = async (
  email,
  role,
  pageNo,
  pageSize
) => {
  const page = Number.parseInt(pageNo);
  const { count, rows } = await userModel.findAccountByEmailAndRolePaginate(
    email,
    role,
    page,
    pageSize
  );

  return { count, rows };
};
exports.findAccountByRole = async (role) => {
  const accounts = await userModel.findAccountByRole(role);
  if (!accounts) {
    return null;
  } else {
    return accounts;
  }
};
exports.findMentorsByCourseId = async (course_id) => {
  const accounts = await userModel.findMentorsByCourseId(course_id);
  if (!accounts) {
    return null;
  } else {
    return accounts;
  }
};
exports.findStudentsByCourseId = async (course_id) => {
  const accounts = await userModel.findStudentsByCourseId(course_id);
  if (!accounts) {
    return null;
  } else {
    return accounts;
  }
};
exports.findAccountByRoles = async (roles) => {
  const accounts = await userModel.findAccountByRoles(roles);
  if (!accounts) {
    return null;
  } else {
    return accounts;
  }
};
exports.getUserDetail = async (email) => {
  try {
    const user = await userModel.getUserDetail(email);
    return user;
  } catch (e) {
    return null;
  }
};
exports.getStudentDetail = async (email) => {
  try {
    const user = await userModel.getStudentDetail(email);
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
};
exports.updateAccountStatus = async (email, current_user_email) => {
  const account = await userModel.findAccountByEmail(email);
  const current_user = await userModel.findAccountByEmail(current_user_email);
  const status = !account.dataValues.active;
  try {
    const { numberOfUpdated, updatedAccount } =
      await userModel.updateAccountStatus(
        email,
        status,
        current_user.dataValues.account_id
      );

    return { numberOfUpdated, updatedAccount };
  } catch (e) {
    return null;
  }
};

exports.updateAccount = async (email, account, current_user_email) => {
  const current_user = await userModel.findAccountByEmail(current_user_email);
  const roles = account.role;
  const roleIDs = [];
  for (let i = 0; i < roles?.length; i++) {
    roleIDs.push(roles[i].value);
  }
  console.log(roleIDs);
  try {
    const result = await userModel.updateAccount(
      email,
      account,
      roleIDs,
      current_user.dataValues.account_id
    );

    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.createNewAccount = async (account, current_user_email) => {
  const current_user = await userModel.findAccountByEmail(current_user_email);
  const roles = account.role;
  const roleIDs = [];
  for (let i = 0; i < roles?.length; i++) {
    roleIDs.push(roles[i].value);
  }
  console.log(roleIDs);
  try {
    const hash = await bcrypt.hash(account?.password, SALT_ROUNDS);
    const result = await userModel.createNewAccount(
      account,
      roleIDs,
      hash,
      current_user.dataValues.account_id
    );

    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
