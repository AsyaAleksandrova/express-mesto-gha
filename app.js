const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const validateNewUser = require('./middlewares/validations');
const errorHandler = require('./middlewares/errorhandler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signup', validateNewUser, createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/\w+@\w+\.\w+/),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Не корректно задан адрес запроса'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
