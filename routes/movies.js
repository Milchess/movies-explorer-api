const express = require('express');
const { celebrate } = require('celebrate');

const movieRoutes = express.Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('./validation');

movieRoutes.get('/movies', getMovies);
movieRoutes.post(
  '/movies',
  celebrate(createMovieValidation),
  createMovie,
);

movieRoutes.delete(
  '/movies/:_id',
  celebrate(deleteMovieValidation),
  deleteMovie,
);

module.exports = movieRoutes;
