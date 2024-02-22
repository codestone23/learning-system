const courseDal = require("../dal/course");
const userModel = require("../dal/account");

exports.findCourseByNameAndStatus = async (name, status, pageNo, pageSize) => {
  const page = Number.parseInt(pageNo);
  const { count, rows } = await courseDal.findCourseByNameAndStatus(
    name,
    Number.parseInt(status),
    page,
    pageSize
  );
  return { count, rows };
};

exports.findCourseById = async (course_id) => {
  const course = await courseDal.findCourseById(course_id);
  if (!course) {
    return null;
  }
  return course;
};

exports.updateCourseStatus = async (course_id, status, email) => {
  const current_user = await userModel.findAccountByEmail(email);
  try {
    const { numberOfUpdated, updatedCourse } =
      await courseDal.updateCourseStatus(
        course_id,
        status,
        current_user.dataValues.account_id
      );

    return { numberOfUpdated, updatedCourse };
  } catch (e) {
    return null;
  }
};

exports.createOrUpdateCourse = async (course, email) => {
  const current_user = await userModel.findAccountByEmail(email);
  const technology = course.technology;
  let formatted_tech = '[{"name":"';
  for (let i = 0; i < technology?.length; i++) {
    formatted_tech += technology[i] + '"}';
    if (i === technology.length - 1) {
      formatted_tech += "]";
    } else {
      formatted_tech += ',{"name":"';
    }
  }
  const students = course.courses_students;
  const studentIds = [];
  for (let i = 0; i < students?.length; i++) {
    studentIds.push(students[i].id);
  }

  try {
    if (course.course_id) {
      const result = await courseDal.updateCourse(
        course,
        current_user.dataValues.account_id,
        formatted_tech,
        studentIds
      );

      return result;
    } else {
      const result = await courseDal.createCourse(
        course,
        current_user.dataValues.account_id,
        formatted_tech,
        studentIds
      );

      return result;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.updateSchedule = async (course, email) => {
  const current_user = await userModel.findAccountByEmail(email);

  try {
    const result = await courseDal.updateSchedule(
      course,
      current_user.dataValues.account_id
    );
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.assignNewMentors = async (course_id, mentors) => {
  try {
    const course = await courseDal.assignNewMentors(course_id, mentors);

    return course;
  } catch (e) {
    return null;
  }
};

exports.assignNewStudents = async (course_id, students) => {
  try {
    const { numberOfUpdated, updatedCourse } =
      await courseDal.assignNewStudents(course_id, students);

    return { numberOfUpdated, updatedCourse };
  } catch (e) {
    return null;
  }
};
