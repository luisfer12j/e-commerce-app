const { Cart } = require('./cart.model');
const { Category } = require('./category.model');
const { Order } = require('./order.model');
const { Product } = require('./product.model');
const { ProductInCart } = require('./productInCart.model');
const { User } = require('./user.model');


const initModels = () => {
    //Users <--> Orders
    User.hasMany(Order)
    Order.belongsTo(User);
    //Users <--> Products
    User.hasMany(Product)
    Product.belongsTo(User);
    //Users <--> Carts
    User.hasOne(Cart)
    Cart.belongsTo(User);
    //Carts <--> Orders
    Cart.hasOne(Order)
    Order.belongsTo(Cart);
    //Carts <--> ProductsInCart
    Cart.hasMany(ProductInCart)
    ProductInCart.belongsTo(Cart);
    //Products <--> ProductsInCart
    Product.hasOne(ProductInCart)
    ProductInCart.belongsTo(Product);
    //Categories <--> Products
    Category.hasOne(Product)
    Product.belongsTo(Category);
}

module.exports = { initModels };