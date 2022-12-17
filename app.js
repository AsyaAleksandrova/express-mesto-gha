const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '639a2f9b484ac8debf93d1ca',
  };
  next();
});

app.use(cookieParser());
app.post('/signup', celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:[\S]{1, }/),
    email: Joi.string().required().regex(/[\S]{1, }@[\w]{1, }\.[\w]{1, 3}/),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', login);
app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use(errors());

app.use((req, res) => {
  res.status(404).send({ message: 'Не корректно задан адрес запроса' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
