const bcrypt = require('bcryptjs');
const { Category, Role, User } = require('../models');

const seedDatabase = async () => {
  const [customerRole] = await Role.findOrCreate({
    where: { name: 'CUSTOMER' },
    defaults: { name: 'CUSTOMER' }
  });
  const [adminRole] = await Role.findOrCreate({
    where: { name: 'ADMIN' },
    defaults: { name: 'ADMIN' }
  });

  const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@marketplace.com';
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
  const existingAdmin = await User.findOne({ where: { email: defaultAdminEmail } });

  if (!existingAdmin) {
    await User.create({
      nombre: 'Administrador',
      email: defaultAdminEmail,
      password: await bcrypt.hash(defaultAdminPassword, 10),
      RoleId: adminRole.id
    });
  }

  const categories = [
    { nombre: 'Computadoras', descripcion: 'Laptops, PCs y accesorios principales' },
    { nombre: 'Accesorios', descripcion: 'Mouse, teclados y perifericos' },
    { nombre: 'Audio', descripcion: 'Audifonos y dispositivos de sonido' },
    { nombre: 'Wearables', descripcion: 'Relojes y pulseras inteligentes' }
  ];

  for (const category of categories) {
    await Category.findOrCreate({
      where: { nombre: category.nombre },
      defaults: category
    });
  }

  return { customerRole, adminRole };
};

module.exports = seedDatabase;
