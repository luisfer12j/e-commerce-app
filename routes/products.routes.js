const express = require('express');

//Middlewares
const { protectToken, protectAdmin } = require('../middlewares/users.middlewares');
const { createProductValidations, checkValidations } = require('../middlewares/validations.middlewares');

//Controllers
const { getAllProducts, createProduct, getProductById, getAllCategories, createCategory, updateProduct, deleteProduct, updateCategory } = require('../controllers/products.controller');


const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/:id', getProductById);

//Protect routes
router.use(protectToken);

router.route('/:id').patch(updateProduct).delete(deleteProduct);
router.post('/', createProductValidations, checkValidations, createProduct);
router.use(protectAdmin);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);

module.exports = { productsRouter: router }