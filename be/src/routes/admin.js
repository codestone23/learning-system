const express = require("express");
const router = express.Router();

const accountController = require("../controllers/account");
const courseController = require("../controllers/course");
const lectureController = require("../controllers/lecture");

router.post("/accounts", accountController.findAccountByEmailAndRolePaginate);
router.post("/accounts/update", accountController.updateAccount);
router.post("/accounts/create", accountController.createNewAccount);
router.post("/accounts/role", accountController.findAccountByRole);
router.post("/mentors/course_id", accountController.findMentorsByCourseId);
router.post("/students/course_id", accountController.findStudentsByCourseId);
router.post("/accounts/roles", accountController.findAccountByRoles);
router.post("/accounts/update_status", accountController.updateAccountStatus);
router.post("/accounts/detail", accountController.findAccountByEmail);
router.post("/accounts/detail_student", accountController.findStudentByEmail);
router.post(
  "/accounts/changePassword",
  accountController.updateAccountPassword
);
router.post("/courses", courseController.findCourseByNameAndStatus);
router.post("/courses/get_course", courseController.findCourseById);
router.post("/courses/update_status", courseController.updateCourseStatus);
router.post("/courses/create", courseController.createOrUpdateCourse);
router.post("/courses/update_schedule", courseController.updateSchedule);
router.post("/lectures/lecture_id", lectureController.findLectureById);
router.post("/courses/assign_mentor", courseController.assignNewMentors);
router.post("/courses/assign_student", courseController.assignNewStudents);
router.post("/schedule", lectureController.getScheduleByAccount);

module.exports = router;
