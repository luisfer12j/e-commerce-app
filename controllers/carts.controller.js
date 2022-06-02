const { Product } = require('../models/product.model');
const { Category } = require('../models/category.model');
const { Cart } = require('../models/cart.model');

const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { ProductInCart } = require('../models/productInCart.model');


const addProduct = catchAsync(async (req, res, next) => {
    const { cart } = req;
    const { productId, quantity } = req.body;
    const productInCart = await ProductInCart.create({ cartId: cart.id, productId, quantity });
    res.status(200).json({ status: 'success', productInCart });
})

const getMyCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const cart = await Cart.findOne({ where: { userId: sessionUser.id }, include: [{ model: ProductInCart, include: [{ model: Product }] }] })
    res.status(200).json({ cart });
})


module.exports = { addProduct, getMyCart }