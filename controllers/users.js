let userModel = require("../schemas/users");
let bcrypt = require('bcrypt');
module.exports = {
    CreateAnUser: async function (username, password, email, role,
        fullName, avatarUrl, status, loginCount
    ) {
        let newItem = new userModel({
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newItem.save();
        return newItem;
    },
    GetAllUser: async function () {
        let users = await userModel
            .find({ isDeleted: false })
        return users;
    },
    GetAnUserByUsername: async function (username) {
        let user = await userModel
            .findOne({
                isDeleted: false,
                username: username
            })
        return user;
    },
    GetAnUserById: async function (id) {
        let user = await userModel
            .findOne({
                isDeleted: false,
                _id: id
            })
        return user;
    },
    ChangePassword: async function (userId, oldPassword, newPassword) {
        let user = await userModel.findOne({
            _id: userId,
            isDeleted: false
        });
        
        if (!user) {
            throw new Error("User not found");
        }
        
        // Verify old password
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            throw new Error("Old password is incorrect");
        }
        
        // Hash new password
        let hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        user.password = hashedPassword;
        await user.save();
        
        return { message: "Password changed successfully" };
    }
}