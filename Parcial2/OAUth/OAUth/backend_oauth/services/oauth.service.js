const jwt = require("jsonwebtoken");
const { users } = require("../models/user.model.js");
const { jwtSecret, jwtExpiresIn } = require("../config/jwt.config.js");

class OAuthService{
    static login(username, password){
        //buscar usuario
        const user = users.find(
            u => u.username === username && u.password === password
        );
        //si no existe el usuario
        if(!user){
            return null;
        }
        //crear el payload del token
        const payload = {
            sub: user.id,
            username: user.username
        }

        //generar el token o firmarlo
        const token = jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiresIn});
        return {
            token,
            user:{
                id: user.id,
                username: user.username,
                nombrCompleto: user.nombrCompleto,
                email: user.email
            }
        };
    }
}

module.exports = OAuthService;