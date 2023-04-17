const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { PORT = 3000, CONNECT = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;
const app = express();

async function main() {
  await mongoose.connect(CONNECT);
  await app.listen(PORT);
}

main();
