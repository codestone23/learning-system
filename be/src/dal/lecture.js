const Course = require("../models/course");
const Account = require("../models/account");
const CourseCategory = require("../models/course_category");
const Lecture = require("../models/lecture");
const Document = require("../models/document");
const sequelize = require("../models/index");
const Attendance = require("../models/attendance");
const CourseStudent = require("../models/course_student");
const { Op, Sequelize } = require("sequelize");

exports.findLectureById = async (lecture_id) => {
  const lecture = await Lecture.findOne({
    where: { lecture_id: lecture_id },
    include: [
      {
        model: Document,
        as: "documents",
      },
      {
        model: Attendance,
        as: "attendances",
        include: [
          {
            model: Account,
            as: "accounts",
            attributes: ["account_id", "name", "avatar"],
          },
        ],
      },
      {
        model: CourseCategory,
        as: "courses_categories",
        include: [
          {
            model: Course,
            as: "courses",
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  return lecture;
};

exports.findAllLecturesByAccountAndTime = async (start, end, account_id) => {
  const lectures = await Lecture.findAll({
    where: {
      date: { [Op.gte]: start, [Op.lte]: end, [Op.ne]: null },
      start_time: { [Op.ne]: null },
      end_time: { [Op.ne]: null },
    },
    include: [
      {
        model: CourseCategory,
        as: "courses_categories",
        include: [
          {
            model: Course,
            as: "courses",
            attributes: ["name"],
            include: [
              {
                model: CourseStudent,
                as: "courses_students",
                attributes: ["student_id"],
                include: [
                  {
                    model: Account,
                    as: "accounts",
                    attributes: ["account_id", "avatar"],
                  },
                ],
              },
              {
                model: Account,
                as: "account_managed",
                attributes: ["avatar"],
              },
            ],
          },
        ],
      },
      {
        model: Account,
        as: "accounts",
        attributes: ["avatar"],
      },
    ],
  });
  return lectures;
};
