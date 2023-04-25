const { Joi } = require('celebrate');
const { regexUrl } = require('../constants');

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const createUserValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
};

const updateUserValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
};

const createMovieValidation = {
  body: Joi.object().keys({
    movieId: Joi.number().integer().required(),
    country: Joi.string().required(),
    duration: Joi.number().required(),
    director: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexUrl),
    trailer: Joi.string().required().regex(regexUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(regexUrl),
  }),
};

const deleteMovieValidation = {
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
};

module.exports = {
  loginValidation,
  createUserValidation,
  updateUserValidation,
  createMovieValidation,
  deleteMovieValidation,
};
