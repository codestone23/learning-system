const accountModel = require("../bll/account");
const authMethod = require("../utils/jwtToken");
const userModel = require("../bll/auth");
exports.findAccountByEmailAndRolePaginate = async (req, res) => {
  const query = req.body.query || "";
  const email = query.email || "";
  const role =
    query.roles.length !== 0
      ? query.roles
      : ["Admin", "Student", "Trainer", "Monitor", "Mentor"];
  const pageNo = query.pageNo || "0";
  const pageSize = query.rowsPerPage || "5";
  console.log({ email, role, pageNo, pageSize });
  try {
    const { count, rows } =
      await accountModel.findAccountByEmailAndRolePaginate(
        email,
        role,
        pageNo,
        pageSize
      );
    const total = count;
    const accounts = rows;

    return res.send({ total, accounts });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server error!" });
  }
};
exports.findAccountByRole = async (req, res) => {
  const role = req.body.role;

  try {
    const accounts = await accountModel.findAccountByRole(role);
    if (!accounts) {
      return res.send({ message: "not found" });
    } else {
      return res.send({ accounts });
    }
  } catch (err) {
    console.log(err);
    return res.send({ message: "Server Error" });
  }
};

exports.findMentorsByCourseId = async (req, res) => {
  const course_id = req.body.course_id;

  try {
    const accounts = await accountModel.findMentorsByCourseId(course_id);
    if (!accounts) {
      return res.send({ message: "not found" });
    } else {
      return res.send({ accounts });
    }
  } catch (err) {
    console.log(err);
    return res.send({ message: "Server Error" });
  }
};

exports.findStudentsByCourseId = async (req, res) => {
  const course_id = req.body.course_id;

  try {
    const accounts = await accountModel.findStudentsByCourseId(course_id);
    if (!accounts) {
      return res.send({ message: "not found" });
    } else {
      return res.send({ accounts });
    }
  } catch (err) {
    console.log(err);
    return res.send({ message: "Server Error" });
  }
};
exports.findAccountByRoles = async (req, res) => {
  const roles = req.body.roles;

  try {
    const accounts = await accountModel.findAccountByRoles(roles);
    if (!accounts) {
      return res.send({ message: "not found" });
    } else {
      return res.send({ accounts });
    }
  } catch (err) {
    console.log(err);
    return res.send({ message: err });
  }
};
exports.updateAccountStatus = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  console.log(verified);
  try {
    const current_user_email = verified.payload.email;
    const { numberOfUpdated, updatedAccount } =
      await accountModel.updateAccountStatus(email, current_user_email);
    console.log(numberOfUpdated);
    if (numberOfUpdated === null) {
      return res.status(500).send({ message: "Updated failed!" });
    } else {
      return res.status(200).send({
        message: "Update account status successfully!",
        account: updatedAccount,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};
exports.findAccountByEmail = async (req, res) => {
  const email = req.body.email || "";

  try {
    const account = await accountModel.getUserDetail(email);
    console.log(account);
    if (!account) {
      return res.send({ message: "Not found" });
    } else {
      return res.send({ account });
    }
  } catch (err) {
    console.log(err);
    return res.send({ message: "Server Error" });
  }
};
exports.findStudentByEmail = async (req, res) => {
  const email = req.body.email || "";

  try {
    const account = await accountModel.getStudentDetail(email);
    console.log(account);
    if (!account) {
      return res.send({ message: "Not found" });
    } else {
      return res.send({ account });
    }
  } catch (err) {
    console.log(err);
    return res.send({ message: err });
  }
};

exports.updateAccountPassword = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  try {
    const verified = await authMethod.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    const current_user_email = verified.payload.email;
    const { numberOfUpdated, updatedAccounts } = await userModel.resetPassword(
      email,
      password,
      current_user_email
    );
    if (numberOfUpdated != 0) {
      return res
        .status(200)
        .send({ message: "Update account password successfully!" });
    } else {
      return res.status(500).send({ message: "Updated failed!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.updateAccount = async (req, res) => {
  const email = req.body.email;
  const account = req.body.account;
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  try {
    const verified = await authMethod.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    const current_user_email = verified.payload.email;
    console.log(current_user_email);
    const result = await accountModel.updateAccount(
      email,
      account,
      current_user_email
    );
    console.log(result);
    if (result) {
      return res.status(200).send({
        message: "Update account successfully!",
        account: result,
      });
    } else {
      return res.status(500).send({ message: "Updated failed!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createNewAccount = async (req, res) => {
  const account = req.body.account;
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const check_account_exist = await accountModel.getUserDetail(account?.email);
  if (check_account_exist) {
    return res.status(204).send({
      message: "This email has already existed!",
    });
  }

  try {
    const verified = await authMethod.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    const current_user_email = verified.payload.email;
    console.log(current_user_email);
    const result = await accountModel.createNewAccount(
      account,
      current_user_email
    );
    if (result) {
      return res.status(200).send({
        message: "Create new account successfully!",
        account: result,
      });
    } else {
      return res.status(500).send({ message: "Created failed!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};
