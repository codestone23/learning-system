import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/admin";

export async function findCourseByNameAndStatus(query) {
  // console.log(query);
  return await axios.post("http://localhost:8080/admin/courses", { query });
}
export async function findCourseById(course_id) {
  return await axios.post("http://localhost:8080/admin/courses/get_course", {
    course_id,
  });
}
export async function updateCourseStatus(course_id, status) {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const headers = {
    x_authorization: `${accessToken}`,
  };

  return await axios.post(
    "http://localhost:8080/admin/courses/update_status",
    {
      course_id,
      status,
    },
    { headers }
  );
}

export async function createOrUpdateCourse(course) {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const headers = {
    x_authorization: `${accessToken}`,
  };
  return await axios.post(
    "http://localhost:8080/admin/courses/create",
    {
      course,
    },
    { headers }
  );
}

export async function findLectureById(lecture_id) {
  return await axios.post("http://localhost:8080/admin/lectures/lecture_id", {
    lecture_id,
  });
}
export async function assignNewMentors(course, mentors) {
  return await axios.post("http://localhost:8080/admin/courses/assign_mentor", {
    course,
    mentors,
  });
}
export async function assignNewStudents(course, students) {
  return await axios.post(
    "http://localhost:8080/admin/courses/assign_student",
    {
      course,
      students,
    }
  );
}

export async function updateSchedule(course) {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const headers = {
    x_authorization: `${accessToken}`,
  };
  return await axios.post(
    "http://localhost:8080/admin/courses/update_schedule",
    {
      course,
    },
    { headers }
  );
}
