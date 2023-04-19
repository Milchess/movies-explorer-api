const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
require('dotenv').config();

const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/notFound');

const { PORT = 3000, CONNECT = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(requestLogger);

app.use(userRoutes);
app.use(movieRoutes);

app.all('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errorLogger);

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
