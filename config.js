module.exports = {
  PORT: 3000,
  CONNECT: (process.env.NODE_ENV === 'production') ? process.env.CONNECT : 'mongodb://0.0.0.0:27017/bitfilmsd',
  JWT_SECRET: (process.env.NODE_ENV === 'production') ? process.env.JWT_SECRET : 'super-strong-secret',
};
