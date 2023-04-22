const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
require('dotenv').config();

const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/notFound');
const { regexUrl, allowedCors } = require('./constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000, CONNECT = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.disable('x-powered-by');
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

app.use(cors({
  origin: (origin, callback) => {
    if (allowedCors.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Вы не прошли CORS проверку'));
    }
  },
}));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regexUrl),
    }),
  }),
  createUser,
);

app.use(auth);
app.use(userRoutes);
app.use(movieRoutes);

app.all('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка'
        : message,
    });
  next();
});

async function main() {
  await mongoose.connect(CONNECT);
  await app.listen(PORT);
}

main();
