const Sequelize = require("sequelize");
const sequelize = require("./index");
const Course = require("./course");
const Account = require("./account");
``;
const CourseStudent = sequelize.define(
  "courses_students",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: Sequelize.INTEGER,
    },
    course_id: {
      type: Sequelize.INTEGER,
    },
  },
  { timestamps: false, paranoid: false }
);

Course.hasMany(CourseStudent, {
  foreignKey: "course_id",
});
CourseStudent.belongsTo(Course, {
  foreignKey: "course_id",
  as: "courses",
});
Account.hasMany(CourseStudent, {
  foreignKey: "student_id",
});
CourseStudent.belongsTo(Account, {
  foreignKey: "student_id",
  as: "accounts",
});

module.exports = CourseStudent;
