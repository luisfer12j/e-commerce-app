const express = require("express");

//Middlewares
const {
    userExists,
    protectToken,
    protectAccountOwner,
} = require('../middlewares/users.middlewares');


//Controllers
const {
    getAllUsers,
    createUser,
    getUserById,
    getMyProducts,
    updateUser,
    deleteUser,
    login,
    checkToken,
    getMyOrders,
    getMyOrderById,
} = require('../controllers/users.controller');

const router = express.Router();

router.post('/', createUser);

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
    // .get(userExists, getUserById)
    .patch(userExists, protectAccountOwner, updateUser)
    .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };