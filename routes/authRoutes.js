const authControllers = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddlewares')
// const { authMiddleware } = require('../middlewares/authMiddleware')

const router = require('express').Router()


router.post("/user-register" , authControllers.user_Register)
router.post("/user-login" , authControllers.user_login)
router.get("/get-user" ,authMiddleware, authControllers.getUser)


module.exports = router