const express = require('express');

//Middlewares
const { protectToken } = require('../middlewares/users.middlewares');

//Controllers
const { getAllProducts, createProduct, getProductById, getAllCategories, createCategory } = require('../controllers/products.controller');


const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/:id', getProductById);
router.route('/:id').patch().delete();

//Protect routes
router.use(protectToken);

router.post('/', createProduct);
router.post('/categories', createCategory);
// router.patch('/categories/:id',);

module.exports = { productsRouter: router }