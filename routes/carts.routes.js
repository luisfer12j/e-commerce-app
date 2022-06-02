const express = require('express');

//Middlewares
const { protectToken } = require('../middlewares/users.middlewares');
const { validCart, validQuantity, validProductExist } = require('../middlewares/carts.middlewares');

//Controllers
const { addProduct, getMyCart } = require('../controllers/carts.controller');


const router = express.Router();

router.use(protectToken);
router.get('/me', getMyCart);
router.post('/add-product', validQuantity, validCart, validProductExist, addProduct);
router.patch('/update-cart',);
router.delete('/:productId',);
router.post('/purchase',);

module.exports = { cartsRouter: router };