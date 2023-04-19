const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../constants');

const movieRoutes = express.Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

movieRoutes.get('/movies', getMovies);
movieRoutes.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
      country: Joi.string().required(),
      director: Joi.string().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(regexUrl),
      trailer: Joi.string().required().regex(regexUrl),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().regex(regexUrl),
    }),
  }),
  createMovie,
);

movieRoutes.delete(
  '/movies/:_Id',
  celebrate({
    params: Joi.object().keys({
      _Id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = movieRoutes;
