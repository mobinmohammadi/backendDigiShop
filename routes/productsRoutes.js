const productControllers = require('../controllers/productsControllers')

const router = require('express').Router()


router.post("/add-product" , productControllers.add_product)



module.exports = router