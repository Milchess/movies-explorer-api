const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();
const { getUser, updateUser } = require('../controllers/users');

userRoutes.get('/users/me', getUser);

userRoutes.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser,
);

module.exports = userRoutes;
