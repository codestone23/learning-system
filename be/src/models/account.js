const Sequelize = require("sequelize");
const sequelize = require("./index");
const Role = require("./role");
const UserDetail = require("./user_detail");
const Account = sequelize.define(
  "accounts",
  {
    account_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    created_at: {
      type: Sequelize.TIME,
    },
    updated_at: {
      type: Sequelize.TIME,
    },
    active: {
      type: Sequelize.BOOLEAN,
    },
    name: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.BOOLEAN,
    },
    university: {
      type: Sequelize.STRING,
    },
    level: {
      type: Sequelize.STRING,
    },
    work_place: {
      type: Sequelize.STRING,
    },
    dob: {
      type: Sequelize.DATE,
    },
    role: {
      type: Sequelize.JSON,
    },
  },
  { timestamps: false, paranoid: false }
);
Role.belongsToMany(Account, {
  through: "accounts_roles",
  foreignKey: "role_id",
  otherKey: "account_id",
  timestamps: false,
});
Account.belongsToMany(Role, {
  through: "accounts_roles",
  foreignKey: "account_id",
  otherKey: "role_id",
  timestamps: false,
});
Account.belongsTo(Account, {
  foreignKey: "created_by",
});
Account.hasOne(Account, {
  foreignKey: "created_by",
});
Account.belongsTo(Account, {
  foreignKey: "managed_by",
});
Account.hasOne(Account, {
  foreignKey: "managed_by",
});
Account.belongsTo(Account, {
  foreignKey: "updated_by",
});
Account.hasOne(Account, {
  foreignKey: "updated_by",
});
Account.belongsTo(UserDetail, {
  foreignKey: "detail_id",
});
UserDetail.hasOne(Account, {
  foreignKey: "detail_id",
});

module.exports = Account;
