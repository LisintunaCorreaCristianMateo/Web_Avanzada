const { Router } = require("express");
const AuthController = require("../controllers/auth.controller.js");

const router = Router();

router.post("/login", AuthController.login);

module.exports = router;
