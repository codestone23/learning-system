const authMethod = require("../utils/jwtToken");
const Account = require("../models/account");
const userModel = require("../dal/account");
isAuth = async (req, res, next) => {
  console.log(req.headers);
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(401).send("Access token not found");
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const verified = await authMethod.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  if (!verified) {
    return res.status(401).send("Access denied");
  }

  const user = await userModel.findAccountByEmail(verified.payload.email);
  req.accounts = user;
  console.log(user);
  console.log(req.accounts);

  return next();
};

isAdmin = (req, res, next) => {
  Account.findByPk(req.accounts.dataValues.account_id).then((account) => {
    account.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "Admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};

const authJwt = {
  isAuth: isAuth,
  isAdmin: isAdmin,
};
module.exports = authJwt;
