const {Router} = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/auth/
router.get('/get', (req, res) => {
    res.send('Hello World!');
})


router.post(
    '/register',
    [
        check('email', 'Некорректный enail').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6})
    ],
    async (req, resp) => {
        try {
            console.log(req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }
            const {email, password} = req.body;

            const candidate = await User.findOne({email})

            if (candidate) {
                return resp.status(400).json({message: "Такой пользователь уже существует"});
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({email, password: hashedPassword});

            await user.save();

            resp.status(201).json({message: "Пользователь создан"})

        } catch (e) {
            resp.status(500).json({message: 'Что-то пошло не так попробуйте снова'})
        }
    })

// /api/auth/login
router.post('/login',
    [
        check('email', 'Введите корректный email')
            .normalizeEmail()
            .isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, resp) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const {email, password} = req.body;

            const user = await User.findOne({email});
            if (!user) {
                return resp.status(400).json({message: 'Пользователь не найден'});
            }
            //WTF COMPERE ??
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return resp.status(400).json({message: 'Неверный пароль попробуйте снова'});
            }

        const token = jwt.sign(
            {userId:user.id},
            config.get('jwtSecret'),
            {expiresIn:'1h'}
            )

            resp.json({token,userId:user.id});

        } catch (e) {
            resp.status(500).json({message: 'Что-то пошло не так попробуйте снова'})
        }
    })

module.exports = router;