import Joi from 'joi';

const validator = (schema) => (playload) =>
  schema.validate(playload, { abortEarly: false });

const signupSchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.number().required(),
  gander: Joi.string().required(),
});

export const validateSignup = validator(signupSchema);
