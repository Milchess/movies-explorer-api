const express = require('express');
const { celebrate } = require('celebrate');

const userRoutes = express.Router();
const { getUser, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('./validation');

userRoutes.get('/users/me', getUser);

userRoutes.patch(
  '/users/me',
  celebrate(updateUserValidation),
  updateUser,
);

module.exports = userRoutes;
