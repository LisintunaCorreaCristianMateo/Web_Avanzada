const{users} = require("../models/user.model.js");

class UserService{
    static getProfile(id){
        const user = users.find(
            u => u.id === id
        );
        if(!user){
            return null;
        }
        return {
            id: user.id,
            username: user.username,    
            nombrCompleto: user.nombrCompleto,
            email: user.email
        };

    }
}

module.exports = UserService;