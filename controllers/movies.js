const Movie = require('../models/movie');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({}).populate(['owner']);
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  await Movie.create({
    owner: req.user, ...req.body,
  })
    .then((movie) => Movie.populate(movie, 'owner'))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы неккоректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      next(new NotFound('Фильм с указанным id не найдена'));
    } else if (movie.owner.equals(req.user._id)) {
      await movie.remove();
      res.send({ message: 'Фильм удален' });
    } else {
      next(new Forbidden('Нельзя удалять фильм созданный не вами'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы неккоректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = { getMovies, createMovie, deleteMovie };
