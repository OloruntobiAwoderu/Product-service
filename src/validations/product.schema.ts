import Joi from 'joi';
import { IAddProductDTO } from '../dtos';
import { generateNumberWithMinCheckSchema, generateStringSchema } from './generic.schema';

/**
 *  Validation schema for checking the validity of the data 
 *  supplied before an item is added to the inventory.
 */
export const addProductSchema: Joi.ObjectSchema<IAddProductDTO> = Joi.object({
    quantity: generateNumberWithMinCheckSchema('Quantity', 1),
    name: generateStringSchema('Item name'),
    expiry: Joi.date().required().timestamp().min(2674800000)
    .messages({
        'any.required': 'Exiry date is required for this process',
        'date.format': 'Expiry date must be a valid timestamp (in milliseconds-since-epoch)',
        'date.min': 'Expiry date should preferable be in the future and not later than the 1970'
    })
});

/**
 *  Validation schema for checking the validity of the data 
 *  supplied before an item is sold.
 */
export const sellProductSchema: Joi.ObjectSchema<Partial<IAddProductDTO>> = Joi.object({
    quantity: generateNumberWithMinCheckSchema('Quantity', 1),
    name: generateStringSchema('Item name'),
});