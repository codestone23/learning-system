const Role = require("../models/role");

const ROLES = async () => {
  const roles = await Role.findAll();
  return roles;
};
module.exports = ROLES;
