const express = require("express");
const router = express.Router();

const { authJwt } = require("../middlewares/index");
const user = require("../controllers/user");

router.post("/profile", [authJwt.isAuth], user.userProfile);

module.exports = router;
