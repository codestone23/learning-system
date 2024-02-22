const Sequelize = require("sequelize");
const sequelize = require("./index");
const Course = require("./course");
const Account = require("./account");
``;
const CourseMentor = sequelize.define(
  "courses_mentors",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: Sequelize.INTEGER,
    },
    mentor_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: false, paranoid: false }
);

Course.hasMany(CourseMentor, {
  foreignKey: "course_id",
});
CourseMentor.belongsTo(Course, {
  foreignKey: "course_id",
});
Account.hasMany(CourseMentor, {
  foreignKey: "mentor_id",
});
CourseMentor.belongsTo(Account, {
  foreignKey: "mentor_id",
  as: "accounts",
});

module.exports = CourseMentor;
