const { Product } = require('../models/product.model');
const { Category } = require('../models/category.model');
const { Cart } = require('../models/cart.model');
const { Order } = require('../models/order.model');

const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { ProductInCart } = require('../models/productInCart.model');


const addProduct = catchAsync(async (req, res, next) => {
    const { cart } = req;
    const { productId, quantity } = req.body;
    const productInCart = await ProductInCart.create({ cartId: cart.id, productId, quantity });
    res.status(200).json({ status: 'success', productInCart });
})

const updateProduct = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const { cart } = req;
    const productUpdated = await ProductInCart.findOne({ where: { cartId: cart.id, productId, status: 'active' } });
    if (!productUpdated) {
        return next(new AppError('Product not found', 404));
    };
    if (quantity === 0) {
        await productUpdated.update({ status: 'removed', quantity: 0 });
        await productUpdated.save();
        res.status(200).json({ status: 'success', message: 'Product removed successfully' });
    }
    await productUpdated.update({ quantity });
    await productUpdated.save();
    res.status(200).json({ status: 'success', product: productUpdated })
});

const removeProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const { cart } = req;
    const productRemoved = await ProductInCart.findOne({ where: { status: 'active', productId, cartId: cart.id } });
    if (!productRemoved) {
        return next(new AppError('Product not found', 404));
    };
    await productRemoved.update({ quantity: 0, status: 'removed' });
    await productRemoved.save();
    res.status(200).json({ status: 'success', message: 'Product removed successfully' });
});

const getMyCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: 'active' },
        include: [{ model: ProductInCart, include: [{ model: Product }] }]
    })
    res.status(200).json({ cart });
});

const purchaseCart = catchAsync(async (req, res, next) => {
    const { cart, sessionUser } = req;
    let totalPrice = 0;
    if (!cart.productInCarts || cart.productInCarts.length === 0) {
        res.status(400).json({ status: 'fail', message: 'Cart is empty' })
    } else {
        const total = cart.productInCarts.map(product => {
            totalPrice = totalPrice + (product.quantity * product.product.price);
            return totalPrice
        })
        const purchasePromises = cart.productInCarts.map(async product => {
            const productUpdated = await Product.findOne({ where: { status: 'active', id: product.productId } });
            const newQty = productUpdated.quantity - product.quantity;
            let newStatus = 'active';
            if (newQty === 0) {
                newStatus = 'removed'
            }
            await productUpdated.update({ quantity: newQty, status: newStatus });
            await productUpdated.save();

            const productInCartUpdated = await ProductInCart.findOne({
                where: { status: 'active', productId: product.productId, cartId: cart.id }
            })
            await productInCartUpdated.update({ status: 'purchased' });
            await productInCartUpdated.save();
            return product;
        })

        await Promise.all(purchasePromises);
        await cart.update({ status: 'purchased' });
        const newOrder = await Order.create({ cartId: cart.id, userId: sessionUser.id, totalPrice: total })
        res.status(200).json({ newOrder });
    }
});


module.exports = { addProduct, getMyCart, updateProduct, removeProduct, purchaseCart };