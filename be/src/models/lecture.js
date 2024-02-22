const Sequelize = require("sequelize");
const sequelize = require("./index");
const CoursesCategory = require("./course_category");
const Account = require("./account");
const Lecture = sequelize.define(
  "lectures",
  {
    lecture_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: Sequelize.INTEGER,
    },
    duration: {
      type: Sequelize.STRING,
    },
    start_time: {
      type: Sequelize.TIME,
    },
    end_time: {
      type: Sequelize.TIME,
    },
    date: {
      type: Sequelize.DATE,
    },
    topic: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    trainer_id: {
      type: Sequelize.INTEGER,
    },
  },
  { timestamps: false, paranoid: false }
);

CoursesCategory.hasMany(Lecture, {
  foreignKey: "category_id",
  as: "lectures",
});
Lecture.belongsTo(CoursesCategory, {
  foreignKey: "category_id",
  as: "courses_categories",
});
Lecture.belongsTo(Account, {
  foreignKey: "trainer_id",
  as: "accounts",
});
Account.hasOne(Lecture, {
  foreignKey: "trainer_id",
  as: "lectures",
});

module.exports = Lecture;
