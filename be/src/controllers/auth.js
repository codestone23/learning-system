const bcrypt = require("bcrypt");
const userModel = require("../bll/auth");
const authMethod = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const createHttpError = require("http-errors");
//const client = require("../config/connection_redis");

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await userModel.getUser(email);

    if (!user) {
      return res.send({ message: "This email does not exist" });
    } else if (!user.dataValues.active) {
      return res.send({ message: "This account is not active" });
    }
    const isPasswordValid = await bcrypt.compareSync(
      password,
      user.dataValues.password
    );
    if (!isPasswordValid) {
      return res.send({ message: "Password is not correct" });
    }

    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;

    const dataForAccessToken = {
      email: user.dataValues.email,
    };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    const refreshToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      refreshTokenLife
    );
    // client.set(
    //   dataForAccessToken.email,
    //   refreshToken,
    //   "EX",
    //   365 * 24 * 60 * 60
    // );
    // client.get(dataForAccessToken.email, (err, result) => {
    //   if (!err) {
    //     console.log(result);
    //   }
    // });
    if (!accessToken) {
      return res.send({ message: "Login Failed!" });
    }
    var authorities = [];
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      return res.status(200).send({
        message: "Login successful",
        user,
        roles: authorities,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: "Internal server error",
      error: e.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    console.log(req);
    const refreshToken = req.headers.x_authorization;
    if (!refreshToken) throw createHttpError[400];
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const verified = await authMethod.verifyRefreshToken(
      refreshToken,
      accessTokenSecret
    );
    if (!verified) {
      return res.status(401).send("Access denied");
    }

    const user = await userModel.getUser(verified.payload.email);
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;

    const dataForAccessToken = {
      email: user.dataValues.email,
    };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    const refreshTokenV2 = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      refreshTokenLife
    );

    var authorities = [];
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      return res.status(200).send({
        message: "Login successful",
        user,
        roles: authorities,
        accessToken: accessToken,
        refreshToken: refreshTokenV2,
      });
    });
  } catch (e) {
    return res.status(500).send({
      message: "Internal server error",
      error: e.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await userModel.getUser(email);

  if (!user) {
    return res.send({ message: "This email does not exist" });
  }
  if (user.dataValues != null && !user.dataValues.active) {
    return res.send({ message: "This account is not active" });
  }

  const passwordResetToken = await authMethod.generateToken(
    email,
    process.env.JWT_SECRET,
    process.env.RESET_PASSWORD_TOKEN_LIFE
  );
  if (!passwordResetToken) {
    return res.send({ message: "Fail to generate reset token" });
  }

  const passwordResetExpires = Date.now() + 10000;

  const resetUrl = `http://${req.body.host}/reset-password?token=${passwordResetToken}`;

  const subject = "Password Reset Request";
  const html = `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset your password here</a>
      `;
  try {
    sendEmail.sendEmail(html, subject, email);
    res.status(200).send({
      message: "Password reset email sent",
      email,
      passwordResetToken,
      passwordResetExpires,
    });
  } catch (err) {
    res.status(500).send({ message: "Failed to send password reset email" });
  }
};

exports.resetPassword = async (req, res) => {
  const resetPasswordToken = req.body.passwordResetToken.split('"').join("");
  const password = req.body.password;
  const passwordResetExpires = req.body.passwordResetExpires;
  // const accessTokenFromHeader = req.headers.x_authorization;
  // const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  // const verified = await authMethod.verifyToken(
  //   accessTokenFromHeader,
  //   accessTokenSecret
  // );

  // const updated_by = verified.payload.email;

  const decoded = await authMethod.decodeToken(
    resetPasswordToken,
    process.env.JWT_SECRET
  );
  if (!decoded) {
    return res.status(400).send({ message: "Access token invalid" });
  }

  const email = decoded.payload;
  try {
    const user = await userModel.getUser(email);

    if (!user && passwordResetExpires < Date.now()) {
      return res
        .status(400)
        .send({ message: "Invalid or expired password reset token!" });
    }
  } catch (err) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }

  try {
    await userModel.resetPassword(email, password, email);
    const subject = "Your password has been changed";
    const html = `
        <p>Your password has been successfully reset. If you did not initiate this request, please contact us immediately.</p>
      `;
    sendEmail.sendEmail(subject, html, email);
    res.status(200).send({
      message: "Reset Password successfully",
    });
  } catch {
    console.error("Failed to send password reset email:", err);
    return res
      .status(500)
      .send({ message: "Failed to send password reset email" });
  }
};
