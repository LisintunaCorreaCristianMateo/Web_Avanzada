const AuthService = require("../services/oauth.service.js");

class AuthController {
    static async login(req, res) {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ msg: "username y password son requeridos" });
        }

        try {
            const result = await AuthService.login(username, password);

            if (!result) {
                return res.status(401).json({ msg: "usuario o contraseña incorrectos" });
            }

            res.json({
                ok: true,
                token: result.token,
                user: result.user,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Error en el servidor" });
        }
    }
}

module.exports = AuthController;
