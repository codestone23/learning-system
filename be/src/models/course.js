const Sequelize = require("sequelize");
const sequelize = require("./index");
const Account = require("../models/account");
const Course = sequelize.define(
  "courses",
  {
    course_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    training_form: {
      type: Sequelize.STRING,
    },
    from_date: {
      type: Sequelize.DATEONLY,
    },
    to_date: {
      type: Sequelize.DATEONLY,
    },
    training_location: {
      type: Sequelize.STRING,
    },
    fee: {
      type: Sequelize.INTEGER,
    },
    color: {
      type: Sequelize.STRING,
    },
    summary: {
      type: Sequelize.STRING,
    },
    // account_id: {
    //   type: Sequelize.INTEGER,
    // },
    created_by: {
      type: Sequelize.INTEGER,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    updated_by: {
      type: Sequelize.INTEGER,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
    managed_by: {
      type: Sequelize.INTEGER,
    },
    technology: {
      type: Sequelize.JSON,
    },
  },
  { timestamps: false, paranoid: false }
);

Course.belongsTo(Account, {
  foreignKey: "created_by",
  as: "account_created",
});
//Account.hasOne(Course);
Course.belongsTo(Account, {
  foreignKey: "managed_by",
  as: "account_managed",
});
//Account.hasOne(Course);

module.exports = Course;
