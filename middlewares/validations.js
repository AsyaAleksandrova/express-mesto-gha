// const { celebrate, Joi } = require('celebrate');

// const validateUser = {
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().regex(/https?\/\/[\S]{1, }/),
//     email: Joi.string().required().regex(/[\S]{1, }@[\w]{1, }\.[\w]{1, 3}/),
//     password: Joi.string().required().min(8),
//   }),
// };

// const validateSomeData = celebrate({
//   params: Joi.object().keys({
//      //валидаторы параметров адреса
//      // в нашем случае это только id
//   }),

//   body: Joi.object().keys({
//     //валидаторы данных передаваемых в body
//   }),

//   headers: Joi.object().keys({
//     //валидатор заголовка, требуется проверять только
//     //наличие заголовка authorization, в запросов которые требуют авторизации
//   }).unknown(),
// });
