const userModel = require("../dal/account");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

exports.getUser = async (email) => {
  const user = await userModel.findAccountByEmail(email);
  if (!user) {
    return null;
  } else {
    return user;
  }
};

exports.resetPassword = async (email, password, updated_by) => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const currentUser = await userModel.findAccountByEmail(updated_by);

  return await userModel.resetPassword(email, hash, currentUser.account_id);
};
