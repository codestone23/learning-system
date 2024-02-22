const Sequelize = require("sequelize");
const sequelize = require("./index");
const Lecture = require("./lecture");
const Account = require("./account");

const Attendance = sequelize.define(
  "attendances",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: Sequelize.INTEGER,
    },
    lecture_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.BOOLEAN,
    },
    reason: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: false, paranoid: false }
);
Lecture.hasMany(Attendance, {
  foreignKey: "lecture_id",
});
Attendance.belongsTo(Lecture, {
  foreignKey: "lecture_id",
});
Account.hasOne(Attendance, {
  foreignKey: "student_id",
});
Attendance.belongsTo(Account, {
  foreignKey: "student_id",
  as: "accounts",
});

module.exports = Attendance;
