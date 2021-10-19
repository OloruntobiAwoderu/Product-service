import Joi from 'joi';

/**
* Generates a re-useable Joi validation schema for fields that only checks for required numbers.
* @param { string } field - Field to be validated.
* @param { string } message - Any general message used for all error types. (Optional)
* @returns { joi.NumberSchema } A Joi validation schema.
*/
export const generateNumberSchema = (field: string, message?: string): Joi.NumberSchema => (
    Joi.number()
    .required()
    .messages({
        'any.required': message || `The ${field} parameter is required`,
        'number.base': message || `The ${field} parameter must be a number`
      })
  );


  /**
* Generates a re-useable Joi validation schema for fields that only checks for required strings.
* @param { string } field - Field to be validated.
* @param { string } message - Any general message used for all error types. (Optional)
* @returns { joi.StringSchema } A Joi validation schema.
*/
export const generateStringSchema = (field: string, message?: string): Joi.StringSchema => (
    Joi.string().required().messages({
      'any.required': message || `The ${field} parameter is required`,
      'string.base': message || `The ${field} parameter must be a string`,
      'string.empty': message || `The ${field} field cannot be an empty string`,
    })
);
  


/**
* Generates a re-useable Joi validation schema for fields that non-required 
strings with a fixed set of values.
* @param { string } field - Field to be validated.
* @param {Array<string>} validOptions - An array of the valid values for the field. 
* @param { string } message - Any general message used for all error types. (Optional)
* @returns { joi.StringSchema } A Joi validation schema.
*/
export const generateValidOptionSchema = (field: string, validOptions: string[], message?: string): Joi.StringSchema => (
    Joi.string().valid(...validOptions).messages({
      'string.base': message || `The ${field} parameter must be a string.`,
      'string.empty': message || `The ${field} field cannot be an empty string.`,
      'any.only': `The ${field} must be one of: ${(validOptions).join(', ')}.`
    })
);
  

/**
* Generates a re-useable Joi validation schema that checks for optional boolean-like fields.
* @param { string } field - Field to be validated.
* @param { string } message - Any general message used for all error types. (Optional)
* @returns { joi.NumberSchema } A Joi validation schema.
*/
export const generateBoolySchema = (field: string, message?: string): Joi.BooleanSchema => (
    Joi.boolean()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false')
    .messages({
        'boolean.base': message || `The ${field} parameter must be a boolean`
      })
  );

/**
* Generates a re-useable Joi validation schema for fields that only checks for required numbers.
* @param { string } field - Field to be validated.
* @param { string } message - Any general message used for all error types. (Optional)
* @returns { joi.NumberSchema } A Joi validation schema.
*/
  export const generateNumberWithMinCheckSchema = (field: string, min: number, message?: string): Joi.NumberSchema => (
    Joi.number()
    .min(min)
    .required()
    .messages({
        'any.required': message || `${field} parameter is required`,
        'number.base': message || `${field} parameter must be a number`,
        'number.min': message || `${field} cannot be less than ${min}`
      })
  );