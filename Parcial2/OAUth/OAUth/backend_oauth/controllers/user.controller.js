const UserService = require("../services/user.service.js");

class UserController {
    static profile(req, res) {
        // Extraer el id del usuario del req.user (establecido por el middleware de autenticación)
        const userId = req.user.sub;

        const perfil = UserService.getProfile(userId);
        if (!perfil) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json({
            ok: true,
            data: perfil,
        });
    }
}

module.exports = UserController;