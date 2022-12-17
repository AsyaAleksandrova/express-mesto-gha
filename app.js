const express = require('express');
// const router = require('express').Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorhandler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '639a2f9b484ac8debf93d1ca',
//   };
//   next();
// });

app.use(cookieParser());
app.post('/signup', createUser);
app.post('/signin', login);

// app.use(auth);
app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));
// app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
