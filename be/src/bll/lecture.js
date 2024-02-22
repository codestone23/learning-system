const lectureDal = require("../dal/lecture");
const userModel = require("../dal/account");

exports.findLectureById = async (lecture_id) => {
  const lecture = await lectureDal.findLectureById(lecture_id);
  if (!lecture) {
    return null;
  }
  return lecture;
};

exports.getScheduleByAccount = async (start, end, email) => {
  const current_user = await userModel.findAccountByEmail(email);
  const lectures = await lectureDal.findAllLecturesByAccountAndTime(
    start,
    end,
    current_user.dataValues.account_id
  );
  if (!lectures) {
    return null;
  }

  return lectures;
};
