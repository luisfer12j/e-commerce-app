const express = require("express");

//Middlewares
const {
    userExists,
    protectToken,
    protectAccountOwner,
} = require('../middlewares/users.middlewares');
const { createUserValidations, checkValidations } = require('../middlewares/validations.middlewares');

//Controllers
const {
    getAllUsers,
    createUser,
    getMyProducts,
    updateUser,
    deleteUser,
    login,
    getMyOrders,
    getMyOrderById,
} = require('../controllers/users.controller');

const router = express.Router();

router.post('/', createUserValidations, checkValidations, createUser);

router.post('/login', login);

// Apply protectToken middleware
router.use(protectToken);

router.get('/', getAllUsers);

// router.get('/check-token', checkToken);
router.get('/me', getMyProducts);
router.get('/orders', getMyOrders);
router.get('/orders/:id', getMyOrderById);

router
    .route('/:id')
    .patch(userExists, protectAccountOwner, updateUser)
    .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };