const Sequelize = require("sequelize");
const sequelize = require("./index");
const UserDetail = sequelize.define(
  "user_details",
  {
    account_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: Sequelize.STRING,
    },
    start_working_time: {
      type: Sequelize.TIME,
    },
    end_working_time: {
      type: Sequelize.TIME,
    },
    grant: {
      type: Sequelize.STRING,
    },
    hired_date: {
      type: Sequelize.DATE,
    },
    identify_information: {
      type: Sequelize.JSON,
    },
    education_information: {
      type: Sequelize.JSON,
    },
    other_information: {
      type: Sequelize.JSON,
    },
  },
  { timestamps: false }
);

module.exports = UserDetail;
