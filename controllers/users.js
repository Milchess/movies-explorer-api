const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Authorization = require('../errors/authorization');
const Conflict = require('../errors/conflict');
const { JWT_SECRET } = require('../config');

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFound('Пользователь с указанным id не найден'));
    } else {
      res.send({
        email: user.email,
        name: user.name,
      });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы неккоректные данные'));
    } else {
      next(err);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      email: req.body.email,
    }, { new: true, runValidators: true });
    if (!user) {
      next(new NotFound('Пользователь с указанным id не найден'));
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы неккоректные данные'));
    } else if (err.code === 11000) {
      next(new Conflict('Данный почтовый адрес уже занят'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new Authorization('Пользователь не найден'));
    }

    const isUserValid = await bcrypt.compare(password, user.password);
    if (isUserValid) {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      return res.send({ token });
    }
    return next(new Authorization('Неверный логин или пароль'));
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });
    res.send({
      email: user.email,
      name: user.name,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы неккоректные данные'));
    } else if (err.code === 11000) {
      next(new Conflict('Данный почтовый адрес уже занят'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUser,
  updateUser,
  login,
  createUser,
};
