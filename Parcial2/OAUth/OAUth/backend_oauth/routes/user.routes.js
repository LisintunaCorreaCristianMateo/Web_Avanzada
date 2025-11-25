const { Router } = require("express");
const UserController = require("../controllers/user.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = Router();

// Ruta protegida
router.get("/profile", authMiddleware, UserController.profile);

module.exports = router;