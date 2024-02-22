const courseBll = require("../bll/course");
const authMethod = require("../utils/jwtToken");

exports.findCourseByNameAndStatus = async (req, res) => {
  const query = req.body.query || "";

  const name = query.name || "";
  const status = query.status || "0";
  const pageNo = query.pageNo || "0";
  const pageSize = query.rowsPerPage || "5";

  try {
    const { count, rows } = await courseBll.findCourseByNameAndStatus(
      name,
      status,
      pageNo,
      pageSize
    );
    const total = count;
    const courses = rows;
    return res.send({ total, courses });
  } catch (err) {
    console.log(err);
    return res.send({ message: "Error Courses: " + err.message });
  }
};

exports.findCourseById = async (req, res) => {
  const course_id = req.body.course_id || "0";
  try {
    const course = await courseBll.findCourseById(Number.parseInt(course_id));
    if (!course) {
      return res.send(null);
    }
    return res.send(course);
  } catch (err) {
    console.log(err);
    return res.send({ message: "Server Error" });
  }
};

exports.updateCourseStatus = async (req, res) => {
  const course_id = req.body.course_id;
  const status = req.body.status;
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  try {
    const email = verified.payload.email;
    const { numberOfUpdated, updatedCourse } =
      await courseBll.updateCourseStatus(course_id, status, email);

    if (numberOfUpdated[0] === 1) {
      return res.status(200).send({
        message: "Update course status successfully!",
        course: updatedCourse,
        numberOfUpdated: numberOfUpdated,
      });
    } else {
      return res.status(500).send({ message: "Updated failed!" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createOrUpdateCourse = async (req, res) => {
  const course = req.body.course;
  console.log(course);
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  try {
    const verified = await authMethod.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    const current_user_email = verified.payload.email;
    console.log(current_user_email);
    const result = await courseBll.createOrUpdateCourse(
      course,
      current_user_email
    );
    if (result) {
      return res.status(200).send({
        message: "Create new course successfully!",
        course: result,
      });
    } else {
      return res.status(500).send({ message: "Created failed!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.updateSchedule = async (req, res) => {
  const course = req.body.course;
  console.log(course);
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  try {
    const verified = await authMethod.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    const current_user_email = verified.payload.email;
    console.log(current_user_email);
    const result = await courseBll.updateSchedule(course, current_user_email);
    if (result) {
      return res.status(200).send({
        message: "Update Schedule successfully!",
        course: result,
      });
    } else {
      return res.status(500).send({ message: "Updated failed!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.assignNewMentors = async (req, res) => {
  console.log(req);
  const course_id = req.body.course || "0";
  const mentors_list = req.body.mentors;
  try {
    const course = await courseBll.assignNewMentors(
      Number.parseInt(course_id),
      mentors_list
    );
    if (!course) {
      return res.status(500).send(null);
    }
    return res.status(200).send(course);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.assignNewStudents = async (req, res) => {
  const course_id = req.body.course || "0";
  const students_list = req.body.students;
  try {
    const course = await courseBll.assignNewStudents(
      Number.parseInt(course_id),
      students_list
    );
    if (!course) {
      return res.send(null);
    }
    return res.send(course);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};
