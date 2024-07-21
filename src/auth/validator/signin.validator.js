import Joi from "joi";
import { BadRequestError } from "../../core/errors/BadRequestError.js";


export const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(3).required().messages({
    "any.required": "Password is required",
  }),
});



export const validateSignIn = (req, res, next) => {
  const { error } = signInSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  next();
};