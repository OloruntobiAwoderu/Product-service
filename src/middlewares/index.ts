import { Request, Response, NextFunction } from 'express';
import { constants, errorResponse, validationHandlerAsync } from '../utils';
import { getSellableInventory } from '../services/product.service';
import { ObjectSchema } from 'joi';

const { VALIDATE_SELLABLE_ERROR } = constants;

/**
   * A middleware that checks if an item has a sellable stock in the inventory.
   *
   * @param { Request } req - The request from the endpoint.
   * @param { Response } res - The response returned by the method.
   * @param { NextFunction } next - Calls the next handler.
   * @returns { Promise< Response | void > } A JSON response that would resolve to an 
   * empty Javascript object for success scenarios or void otherwise.
   */
  export const sellableItemCheck = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { params: { item }, body: { quantity }} = req;
        const result  = await getSellableInventory({name: item, quantity});
        if(result.error) {
        errorResponse(res, result.error, 400);
        } else {
            req.items = result.data;
            next();
        }
        }
    catch(error) {
        logger.error(`${VALIDATE_SELLABLE_ERROR}: ${error.message}`);
        errorResponse(res, VALIDATE_SELLABLE_ERROR);
    }
}

/**
   * A middleware that validates data sent through the endpoint.
   *
 * @param { ObjectSchema<T> } schema -  The pre-defined schema used to determine the validation rules.
   * @returns { Function }
   */
  export const dataValidator = <T>(schema: ObjectSchema<T>) =>  
  async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
            await validationHandlerAsync(schema, { name: req.params.item, ...req.body });
            logger.info('Successfully passed validation.')
            next();
    } catch(error) {
        const { message } = error;
        logger.error(`Validation failed: ${message}.`);
        errorResponse(res, message, 400);
    }
  };
