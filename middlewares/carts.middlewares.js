// Models
const { Cart } = require('../models/cart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');

const validCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const cart = await Cart.findOne({ where: { status: 'active', userId: sessionUser.id } })
    if (!cart) {
        const newCart = await Cart.create({ userId: sessionUser.id });
        req.cart = newCart;
        next();
    }
    req.cart = cart;
    next();
})

const validQuantity = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const product = await Product.findOne({ where: { status: 'active', id: productId } });
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    if (quantity > product.quantity) {
        return next(new AppError('Quantity exceeds stock', 400));
    }
    req.product = product;
    next();
});

const validProductExist = catchAsync(async (req, res, next) => {
    const { cart, product } = req;
    const { quantity } = req.body;
    const productRepeated = await ProductInCart.findOne({ where: { cartId: cart.id, productId: product.id } });
    console.log(!productRepeated);
    if (!productRepeated) {
        console.log('hola');
        next();
    } else {
        if (productRepeated.status === 'removed') {
            await productRepeated.update({ status: 'active', quantity });
            await productRepeated.save();
            // req.productRepeated = true;
            // req.productInCart = productRepeated;
            res.status(200).json({ status: 'success', productInCart: productRepeated });
        }
        if (productRepeated.status === 'active') {
            return next(new AppError('Product already exist', 400));
        }
    }
})

module.exports = { validCart, validQuantity, validProductExist };