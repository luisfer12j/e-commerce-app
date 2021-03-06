const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// require('crypto').randomBytes(64).toString('hex')

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Cart } = require('../models/cart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });

  res.status(200).json({
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    user,
  });
});

const getMyProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const myProducts = await Product.findAll({ where: { userId: sessionUser.id } })

  res.status(200).json({
    status: 'Success',
    products: myProducts
  })
})

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({ status: 'success' });
});

const getMyOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const myOrders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: [{ model: Cart, include: [{ model: ProductInCart }] }]
  })
  res.status(200).json({ status: 'success', orders: myOrders })
});

const getMyOrderById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params
  const order = await Order.findOne({
    where: { id, userId: sessionUser.id },
    include: [{
      model: Cart, include: [{
        model: ProductInCart, required: false,
        where: { status: 'purchased' },
      }]
    }]
  })
  if (!order) {
    return next(new AppError('Order not found', 404));
  }
  res.status(200).json({ status: 'success', order })
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getMyProducts,
  getMyOrders,
  getMyOrderById,
  updateUser,
  deleteUser,
  login,
  checkToken,
};
