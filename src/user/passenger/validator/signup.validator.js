import Joi from "joi";

import { BadRequestError } from "../../../core/errors/BadRequestError.js";

export const passengerSignupSchema = Joi.object({
  workAddress: Joi.string().required().messages({
    "any.required": "Work address is required",
  }),
  workEmail: Joi.string().email().required().messages({
    "string.email": "Valid work email is required",
    "any.required": "Work email is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  firstName: Joi.string().required().messages({
    "any.required": "First name is required",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
  }),
  lastName: Joi.string().allow(null, ""),
  profession: Joi.string().required().messages({
    "any.required": "Profession is required",
  }),
  companyName: Joi.string().required().messages({
    "any.required": "Company name is required",
  })
});


export const validateSignup = (req, res, next) => {
  const { error } = passengerSignupSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  next();
};
