const express = require('express');

//Middlewares
const { protectToken } = require('../middlewares/users.middlewares');
const { validCart, validQuantity, validProductExist } = require('../middlewares/carts.middlewares');

//Controllers
const { addProduct, getMyCart, updateProduct, removeProduct, purchaseCart } = require('../controllers/carts.controller');


const router = express.Router();

router.use(protectToken);
router.post('/add-product', validQuantity, validCart, validProductExist, addProduct);
router.patch('/update-cart', validQuantity, validCart, updateProduct);
router.delete('/:productId', validCart, removeProduct);
router.post('/purchase', validCart, purchaseCart);

//An additional route to see all my cart
router.get('/me', validCart, getMyCart);

module.exports = { cartsRouter: router };