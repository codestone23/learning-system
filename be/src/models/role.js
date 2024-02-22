const Sequelize = require("sequelize");
const sequelize = require("./index");
const Role = sequelize.define(
  "roles",
  {
    role_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: false, paranoid: false }
);
module.exports = Role;
