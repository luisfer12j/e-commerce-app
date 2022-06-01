const { Product } = require('../models/product.model');
const { Category } = require('../models/category.model');

const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({ where: { status: 'active' }, include: [{ model: Category }] });
    res.status(200).json({ status: 'success', products });
});

const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id, status: 'active' }, include: [{ model: Category }] });
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    res.status(200).json({ status: 'success', product });
});

const createProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, quantity, categoryId } = req.body;
    const { sessionUser } = req;
    const newProduct = await Product.create({ title, description, price, quantity, userId: sessionUser.id, categoryId })
    res.status(200).json({ status: 'success', newProduct });
});

const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.findAll({ where: { status: 'active' } });
    res.status(200).json({ status: 'success', categories });
});

const createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(200).json({ status: 'success', newCategory });
});

module.exports = { getAllProducts, createProduct, getProductById, getAllCategories, createCategory };