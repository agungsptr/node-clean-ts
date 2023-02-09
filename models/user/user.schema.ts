import Joi from "joi";

const schema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  secretUuid: Joi.string().guid({
    version: ["uuidv4"],
  }),
  createdAt: Joi.date().timestamp(),
  updatedAt: Joi.date().timestamp(),
});

export default schema;
