var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs');
let path = require('path');
const { CheckLogin } = require("../utils/authHandler");
const { ChangePasswordValidator, validatedResult } = require("../utils/validateHandler");

// Load private key for RS256
const privateKeyPath = path.join(__dirname, '../keys/private.pem');
let privateKey = '';

if (fs.existsSync(privateKeyPath)) {
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
}

router.post('/register', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let newUser = await userController.CreateAnUser(
            username, password, email, "69b0ddec842e41e8160132b8"
        )
        res.send(newUser)
    } catch (error) {
        res.status(404).send(error.message)
    }

})
router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let user = await userController.GetAnUserByUsername(username);
        if (!user) {
            res.status(404).send({
                message: "thong tin dang nhap sai"
            })
            return;
        }
        if (user.lockTime > Date.now()) {
            res.status(404).send({
                message: "ban dang bi ban"
            })
            return
        }
        if (bcrypt.compareSync(password, user.password)) {
            loginCount = 0;
            await user.save()
            // Sign with RS256 using private key
            let token = jwt.sign({
                id: user._id
            }, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h'
            })
            res.send(token)
        } else {
            user.loginCount++;
            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = Date.now() + 3600 * 1000
            }
            await user.save()
            res.status(404).send({
                message: "thong tin dang nhap sai"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }

})
router.get('/me',CheckLogin,function(req,res,next){
    res.send(req.user)
})

router.post('/changepassword', CheckLogin, ChangePasswordValidator, validatedResult, async function(req, res, next) {
    try {
        let { oldpassword, newpassword } = req.body;
        let result = await userController.ChangePassword(req.user._id, oldpassword, newpassword);
        res.send(result);
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
})

module.exports = router;