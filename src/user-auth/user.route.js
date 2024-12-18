const router = require('express').Router();
const UserService = require('./user.service')
const passwordValidation = require('../helper/password-validation');
const emailValidation = require('../helper/email-validator');

router.post('/signup',async (req, res) => {
     
        const result = await UserService.userSignUp(req, res);
        return result


    })
router.post('/login',
    emailValidation,
    async (req, res) => {
        const result = await UserService.logIn(req, res);
        return result

    })
router.get('/getone',
    async (req, res) => {
        const result = await UserService.userGetOne(req, res);
        return result

    })

module.exports = router