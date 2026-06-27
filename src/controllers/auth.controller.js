const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Role, User } = require('../models');

const createToken = (user, role) => jwt.sign(
  {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    role
  },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

const formatUser = (user, role) => ({
  id: user.id,
  nombre: user.nombre,
  email: user.email,
  role
});

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y password son requeridos',
        data: null
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya esta registrado',
        data: null
      });
    }

    const customerRole = await Role.findOne({ where: { name: 'CUSTOMER' } });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      RoleId: customerRole.id
    });
    const token = createToken(user, customerRole.name);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        token,
        user: formatUser(user, customerRole.name)
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      data: null
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son requeridos',
        data: null
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [Role]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales invalidas',
        data: null
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales invalidas',
        data: null
      });
    }

    const role = user.Role.name;
    const token = createToken(user, role);

    res.json({
      success: true,
      message: 'Inicio de sesion correcto',
      data: {
        token,
        user: formatUser(user, role)
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesion:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesion',
      data: null
    });
  }
};
