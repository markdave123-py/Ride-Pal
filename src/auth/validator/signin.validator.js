import Joi from "joi";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { validateSchema } from "../../core/utils/validateSchema.js";


export const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("(?=.*[a-z])"))
    .pattern(new RegExp("(?=.*[A-Z])"))
    .pattern(new RegExp("(?=.*[0-9])"))
    .pattern(new RegExp('(?=.*[!@#$%^&*(),.?":{}|<>])'))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must not exceed 30 characters.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.empty": "Password is required.",
    }),
});



// export const validateSignIn = (req, res, next) => {
//   const { error } = signInSchema.validate(req.body, { abortEarly: false });

//   if (error) {
//     const errorMessage = error.details
//       .map((detail) => detail.message)
//       .join(", ");
//     return next(new BadRequestError(errorMessage));
//   }

//   next();
// };

export const validateSignIn =  validateSchema(signInSchema);