import Joi from 'joi';

// Define validation for adding a contact
const addContactValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
export { addContactValidation };
