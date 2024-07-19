import Joi from "joi";


export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*\d+).*$/)
    .required()
    .messages({
      'string.min': 'password must be at least 8 characters long',
      'string.pattern.base': 'password must contain at least one uppercase letter and one or more numbers',
      'any.required': 'password is required',
    }),
});