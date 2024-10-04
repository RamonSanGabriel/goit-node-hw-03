import Joi from 'joi';

const contactValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

// validation for updating favorite field
const favoriteValidation = Joi.object({
  favorite: Joi.bool().required(),
});
// Define validation for adding a contact
const signUpValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'any.required': 'Missing required email field',
      'string.email': 'Invalid email',
    }),
  password: Joi.string().min(6).max(16).required().messages({
    'any.required': 'Missing required email field',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must not exceed 16 characters',
  }),
});

const subscriptionValidation = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});
// prettier-ignore
export { contactValidation, favoriteValidation, signUpValidation, subscriptionValidation };
