const Course = require("../models/course");
const Account = require("../models/account");
const CourseCategory = require("../models/course_category");
const CourseMentor = require("../models/course_mentor");
const CourseStudent = require("../models/course_student");
const Lecture = require("../models/lecture");
const Document = require("../models/document");
const sequelize = require("../models/index");

const { Op } = require("sequelize");

exports.findCourseByNameAndStatus = async (name, status, page, pageSize) => {
  console.log({ name, status, page, pageSize });
  let statusFilter;
  if (status === 0) {
    statusFilter = {
      [Op.between]: [1, 4],
    };
  } else {
    statusFilter = status;
  }
  const { count, rows } = await Course.findAndCountAll({
    limit: pageSize,
    offset: page * pageSize,
    attributes: [
      "course_id",
      "name",
      // "created_by",
      "training_form",
      // "managed_by",
      "status",
      "from_date",
      "to_date",
    ],
    where: {
      name: {
        [Op.substring]: name,
      },
      status: statusFilter,
    },
    include: [
      {
        model: CourseCategory,
        as: "courses_categories",
        include: {
          model: Lecture,
          as: "lectures",
          attributes: ["lecture_id", "topic", "status"],
        },
      },
      {
        model: CourseStudent,
        as: "courses_students",
        attributes: ["student_id"],
      },
      {
        model: CourseMentor,
        as: "courses_mentors",
        attributes: ["mentor_id"],
      },
      {
        model: Account,
        as: "account_created",
        attributes: ["account_id", "avatar", "name"],
      },
      {
        model: Account,
        as: "account_managed",
        attributes: ["account_id", "avatar", "name"],
      },
    ],
    distinct: true,
  });
  return { count, rows };
};

exports.findCourseById = async (course_id) => {
  const course = await Course.findOne({
    where: { course_id: course_id },
    attributes: [
      "course_id",
      "name",
      "training_form",
      "training_location",
      "created_by",
      "managed_by",
      "from_date",
      "to_date",
      "status",
      "fee",
      "summary",
      "created_at",
      "updated_at",
      "updated_by",
      "technology",
    ],
    include: [
      {
        model: CourseCategory,
        as: "courses_categories",
        include: {
          model: Lecture,
          as: "lectures",
          attributes: [
            "lecture_id",
            "category_id",
            "date",
            "duration",
            "topic",
            "status",
            "trainer_id",
            "description",
            "start_time",
            "end_time",
          ],
          include: [
            {
              model: Account,
              as: "accounts",
              attributes: ["account_id", "name", "avatar"],
            },
            {
              model: Document,
              as: "documents",
            },
          ],
        },
        order: [["category_id", "ASC"]],
      },
      {
        model: CourseStudent,
        as: "courses_students",
        attributes: ["student_id"],
        include: {
          model: Account,
          as: "accounts",
          attributes: ["account_id", "name", "avatar"],
        },
      },
      {
        model: CourseMentor,
        as: "courses_mentors",
        attributes: ["mentor_id"],
        include: {
          model: Account,
          as: "accounts",
          attributes: ["account_id", "name"],
        },
      },
      {
        model: Account,
        as: "account_managed",
      },
    ],
    order: [[CourseCategory, Lecture, "date", "ASC"]],
  });
  return course;
};

exports.updateCourseStatus = async (course_id, status, updated_by) => {
  let updateData = {
    status: status,
    updated_at: new Date(),
    updated_by: updated_by,
  };
  if (status === 2) {
    const currentDate = new Date();
    updateData.from_date = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
  }
  const numberOfUpdated = await Course.update(updateData, {
    where: { course_id: course_id },
  });
  const updatedCourse = await Course.findOne({
    attributes: [
      "course_id",
      "name",
      "training_form",
      "status",
      "from_date",
      "to_date",
    ],
    where: {
      course_id: { [Op.eq]: course_id },
    },
    include: [
      {
        model: CourseCategory,
        as: "courses_categories",
        include: {
          model: Lecture,
          as: "lectures",
          attributes: ["lecture_id", "topic", "status"],
        },
      },
      {
        model: CourseStudent,
        as: "courses_students",
        attributes: ["student_id"],
      },
      {
        model: CourseMentor,
        as: "courses_mentors",
        attributes: ["mentor_id"],
      },
      {
        model: Account,
        as: "account_created",
        attributes: ["account_id", "avatar", "name"],
      },
      {
        model: Account,
        as: "account_managed",
        attributes: ["account_id", "avatar", "name"],
      },
    ],
  });
  return { numberOfUpdated, updatedCourse };
};
exports.updateCourse = async (course, updated_by, technology, students) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      await Course.update(
        {
          name: course?.name,
          training_form: course?.training_form,
          from_date: course?.from_date,
          to_date: course?.to_date,
          training_location: course?.training_location,
          updated_at: Date.now(),
          updated_by: updated_by,
          fee: Number.parseInt(course?.fee),
          summary: course?.summary,
          managed_by: Number.parseInt(course?.managed_by),
          technology: JSON.parse(technology),
        },

        { where: { course_id: course.course_id } },
        { transaction: t }
      );
      const updated_course = await Course.findOne(
        {
          where: { course_id: course.course_id },
        },
        { transaction: t }
      );
      for (let i = 0; i < course.courses_students.length; i++) {
        const studentJoin = await CourseStudent.findOne(
          {
            where: {
              course_id: updated_course.course_id,
              student_id: course.courses_students[i].id,
            },
          },
          { transaction: t }
        );
        if (!studentJoin) {
          await CourseStudent.create(
            {
              student_id: course.courses_students[i].id,
              course_id: updated_course.course_id,
            },
            { transaction: t }
          );
        }
      }
      await CourseStudent.destroy(
        {
          where: {
            student_id: { [Op.notIn]: students },
            course_id: updated_course.course_id,
          },
        },
        { transaction: t }
      );

      for (let i = 0; i < course.courses_categories.length; i++) {
        if (course.courses_categories[i].category_id === "") {
          const category = await CourseCategory.create(
            {
              course_id: course.courses_categories[i]?.course_id,
              category_name: course.courses_categories[i]?.category_name,
            },
            { transaction: t }
          );
          for (
            let x = 0;
            x < course.courses_categories[i].lectures.length;
            x++
          ) {
            await Lecture.create(
              {
                category_id: category.category_id,
                duration: course.courses_categories[i].lectures[x]?.duration,
                date:
                  course.courses_categories[i].lectures[x]?.date || Date.now(),
                topic: course.courses_categories[i].lectures[x]?.topic,
                status: 2,
                trainer_id: course.courses_categories[i].lectures[x].trainer_id,
              },
              { transaction: t }
            );
          }
        } else {
          const category = await CourseCategory.update(
            {
              category_name: course.courses_categories[i]?.category_name,
            },
            {
              where: { category_id: course.courses_categories[i].category_id },
            },
            { transaction: t }
          );

          let listLectures = [];
          for (
            let x = 0;
            x < course.courses_categories[i].lectures.length;
            x++
          ) {
            if (course.courses_categories[i].lectures[x]) {
              if (course.courses_categories[i].lectures[x].lecture_id === "") {
                await Lecture.create(
                  {
                    category_id:
                      course.courses_categories[i].lectures[x]?.category_id,
                    duration:
                      course.courses_categories[i].lectures[x]?.duration,
                    date:
                      course.courses_categories[i].lectures[x]?.date ||
                      Date.now(),
                    topic: course.courses_categories[i].lectures[x]?.topic,
                    status: course.courses_categories[i].lectures[x]?.status,
                    trainer_id:
                      course.courses_categories[i].lectures[x]?.trainer_id,
                  },
                  { transaction: t }
                );
              } else {
                listLectures.push(
                  Number.parseInt(
                    course.courses_categories[i].lectures[x].lecture_id
                  )
                );
                console.log(
                  course.courses_categories[i].lectures[x].lecture_id
                );
                await Lecture.update(
                  {
                    duration:
                      course.courses_categories[i].lectures[x]?.duration,
                    date:
                      course.courses_categories[i].lectures[x]?.date ||
                      Date.now(),
                    topic: course.courses_categories[i].lectures[x]?.topic,
                    status: course.courses_categories[i].lectures[x]?.status,
                    trainer_id:
                      course.courses_categories[i].lectures[x]?.trainer_id,
                  },
                  {
                    where: {
                      lecture_id:
                        course.courses_categories[i].lectures[x].lecture_id,
                    },
                  },
                  { transaction: t }
                );
              }
            }
          }
          await Lecture.destroy(
            {
              where: {
                lecture_id: { [Op.notIn]: listLectures },
                category_id: course.courses_categories[i].category_id,
              },
            },
            { transaction: t }
          );
          console.log(course.courses_categories[i].lectures.length);
        }
      }
    });
    const updated_course = await Course.findOne({
      where: {
        course_id: course.course_id,
      },
    });
    return updated_course;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.updateSchedule = async (course, updated_by) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      await Course.update(
        {
          updated_at: Date.now(),
          updated_by: updated_by,
        },
        { where: { course_id: course.course_id } },
        { transaction: t }
      );
      const updated_course = await Course.findOne(
        {
          where: { course_id: course.course_id },
        },
        { transaction: t }
      );
      for (let i = 0; i < course.courses_categories.length; i++) {
        if (course.courses_categories[i].category_id === "") {
          const category = await CourseCategory.create(
            {
              course_id: course.courses_categories[i]?.course_id,
              category_name: course.courses_categories[i]?.category_name,
            },
            { transaction: t }
          );
          for (
            let x = 0;
            x < course.courses_categories[i].lectures.length;
            x++
          ) {
            await Lecture.create(
              {
                category_id: category.category_id,
                duration: course.courses_categories[i].lectures[x]?.duration,
                date:
                  course.courses_categories[i].lectures[x]?.date || Date.now(),
                topic: course.courses_categories[i].lectures[x]?.topic,
                status: 2,
                trainer_id: course.courses_categories[i].lectures[x].trainer_id,
              },
              { transaction: t }
            );
          }
        } else {
          const category = await CourseCategory.update(
            {
              category_name: course.courses_categories[i]?.category_name,
            },
            {
              where: { category_id: course.courses_categories[i].category_id },
            },
            { transaction: t }
          );

          let listLectures = [];
          for (
            let x = 0;
            x < course.courses_categories[i].lectures.length;
            x++
          ) {
            if (course.courses_categories[i].lectures[x]) {
              if (course.courses_categories[i].lectures[x].lecture_id === "") {
                await Lecture.create(
                  {
                    category_id:
                      course.courses_categories[i].lectures[x]?.category_id,
                    duration:
                      course.courses_categories[i].lectures[x]?.duration,
                    date:
                      course.courses_categories[i].lectures[x]?.date ||
                      Date.now(),
                    topic: course.courses_categories[i].lectures[x]?.topic,
                    status: course.courses_categories[i].lectures[x]?.status,
                    trainer_id:
                      course.courses_categories[i].lectures[x]?.trainer_id,
                  },
                  { transaction: t }
                );
              } else {
                listLectures.push(
                  Number.parseInt(
                    course.courses_categories[i].lectures[x].lecture_id
                  )
                );
                console.log(
                  course.courses_categories[i].lectures[x].lecture_id
                );
                await Lecture.update(
                  {
                    duration:
                      course.courses_categories[i].lectures[x]?.duration,
                    date:
                      course.courses_categories[i].lectures[x]?.date ||
                      Date.now(),
                    topic: course.courses_categories[i].lectures[x]?.topic,
                    status: course.courses_categories[i].lectures[x]?.status,
                    trainer_id:
                      course.courses_categories[i].lectures[x]?.trainer_id,
                  },
                  {
                    where: {
                      lecture_id:
                        course.courses_categories[i].lectures[x].lecture_id,
                    },
                  },
                  { transaction: t }
                );
              }
            }
          }
          await Lecture.destroy(
            {
              where: {
                lecture_id: { [Op.notIn]: listLectures },
                category_id: course.courses_categories[i].category_id,
              },
            },
            { transaction: t }
          );
          console.log(course.courses_categories[i].lectures.length);
        }
      }
    });
    const updated_course = await Course.findOne({
      where: {
        course_id: course.course_id,
      },
    });
    return updated_course;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.createCourse = async (course, created_by, technology, students) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const new_course = await Course.create(
        {
          name: course?.name,
          training_form: course?.training_form,
          from_date: course?.from_date,
          to_date: course?.to_date,
          training_location: course?.training_location,
          created_at: Date.now(),
          created_by: created_by,
          fee: Number.parseInt(course?.fee) || 0,
          summary: course?.summary,
          status: 1,
          managed_by: Number.parseInt(course?.managed_by),
          technology: JSON.parse(technology),
          color: "red",
        },

        { transaction: t }
      );

      for (let i = 0; i < course.courses_students.length; i++) {
        await CourseStudent.create(
          {
            student_id: course.courses_students[i].id,
            course_id: new_course.course_id,
          },
          { transaction: t }
        );
      }

      for (let i = 0; i < course.courses_categories.length; i++) {
        const category = await CourseCategory.create(
          {
            course_id: new_course.course_id,
            category_name: course.courses_categories[i]?.category_name,
          },
          { transaction: t }
        );
        for (let x = 0; x < course.courses_categories[i].lectures.length; x++) {
          const mentor_join = await CourseMentor.findOne(
            {
              where: {
                course_id: new_course.course_id,
                mentor_id: course.courses_categories[i].lectures[x].trainer_id,
              },
            },
            { transaction: t }
          );

          console.log(mentor_join);

          if (!mentor_join) {
            await CourseMentor.create(
              {
                course_id: new_course.course_id,
                mentor_id: course.courses_categories[i].lectures[x].trainer_id,
              },
              { transaction: t }
            );
          }
          await Lecture.create(
            {
              category_id: category.category_id,
              duration: course.courses_categories[i].lectures[x]?.duration,
              date:
                course.courses_categories[i].lectures[x]?.date || Date.now(),
              topic: course.courses_categories[i].lectures[x]?.topic,
              status: 0,
              trainer_id: course.courses_categories[i].lectures[x].trainer_id,
            },
            { transaction: t }
          );
        }
      }
    });

    const new_course = await Course.findAll(
      {
        order: [["course_id", "DESC"]],
      },
      { limit: 1 }
    );
    return new_course;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.assignNewMentors = async (course_id, mentors) => {
  try {
    const list_mentors = [];
    const result = await sequelize.transaction(async (t) => {
      for (let i = 0; i < mentors.length; i++) {
        const account = await Account.findOne(
          {
            where: { email: mentors[i].email },
          },
          { transaction: t }
        );
        console.log(account);
        list_mentors.push(account.account_id);
        const mentor_join = await CourseMentor.findOne(
          { where: { course_id: course_id, mentor_id: account.account_id } },
          { transaction: t }
        );
        if (!mentor_join) {
          await CourseMentor.create(
            {
              course_id: course_id,
              mentor_id: account.account_id,
            },
            { transaction: t }
          );
        } else {
          await CourseMentor.update(
            {
              status: true,
            },
            {
              where: {
                course_id: course_id,
                mentor_id: account.account_id,
              },
            },
            { transaction: t }
          );
        }
      }
      await CourseMentor.update(
        {
          status: false,
        },
        {
          where: {
            course_id: course_id,
            mentor_id: { [Op.notIn]: list_mentors },
          },
        },
        { transaction: t }
      );
    });
    const course = await Course.findOne({ where: { course_id: course_id } });
    return course;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

exports.assignNewStudents = async (course_id, students) => {
  try {
    const list_students = [];
    const result = await sequelize.transaction(async (t) => {
      for (let i = 0; i < students.length; i++) {
        const account = await Account.findOne(
          {
            where: { email: students[i].email },
          },
          { transaction: t }
        );
        list_students.push(account.account_id);
        const students_join = await CourseStudent.findOne(
          {
            where: {
              course_id: course_id,
              student_id: account.account_id,
            },
          },
          { transaction: t }
        );
        if (!students_join) {
          await CourseStudent.create(
            {
              course_id: course_id,
              student_id: account.account_id,
            },
            { transaction: t }
          );
        }
      }
      await CourseStudent.destroy(
        {
          where: {
            course_id: course_id,
            student_id: { [Op.notIn]: list_students },
          },
        },
        { transaction: t }
      );
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
