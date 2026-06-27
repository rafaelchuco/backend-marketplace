const Product = require('./Product');
const Category = require('./Category');
const Role = require('./Role');
const User = require('./User');

Category.hasMany(Product, { foreignKey: 'CategoryId' });
Product.belongsTo(Category, { foreignKey: 'CategoryId' });

Role.hasMany(User, { foreignKey: 'RoleId' });
User.belongsTo(Role, { foreignKey: 'RoleId' });

module.exports = {
  Product,
  Category,
  Role,
  User
};
