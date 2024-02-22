const accountModel = require("../bll/account");
const authMethod = require("../utils/jwtToken");
exports.userProfile = async (req, res) => {
  const accessTokenFromHeader = req.headers.x_authorization;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );

  try {
    const email = verified.payload.email;

    const user = await accountModel.getUserDetail(email);
    if (!user) {
      return res.send({ message: "not found" });
    } else {
      return res.send(user);
    }
  } catch (err) {
    console.log(err);
    return res.send({ message: "Server Error" });
  }
};
