const lectureBll = require("../bll/lecture");
const authMethod = require("../utils/jwtToken");

exports.findLectureById = async (req, res) => {
  const lecture_id = req.body.lecture_id || "0";
  try {
    const lecture = await lectureBll.findLectureById(
      Number.parseInt(lecture_id)
    );
    if (!lecture) {
      return res.send(null);
    }
    return res.send(lecture);
  } catch (err) {
    console.log(err);
    return res.send({ message: "Server Error" });
  }
};

exports.getScheduleByAccount = async (req, res) => {
  const start = req.body.start;
  const end = req.body.end;
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  try {
    const email = verified.payload.email;
    const lectures = await lectureBll.getScheduleByAccount(start, end, email);

    if (lectures) {
      return res.status(200).send({
        lectures: lectures,
      });
    } else {
      return res.status(200).send({ lectures: [] });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error" });
  }
};
