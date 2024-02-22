const Sequelize = require("sequelize");
const sequelize = require("./index");
const Course = require("./course");
const CourseCategory = sequelize.define(
  "courses_categories",
  {
    category_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: Sequelize.INTEGER,
    },
    category_name: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: false, paranoid: false }
);
Course.hasMany(CourseCategory, {
  foreignKey: "course_id",
});
CourseCategory.belongsTo(Course, {
  foreignKey: "course_id",
  as: "courses",
});

module.exports = CourseCategory;
