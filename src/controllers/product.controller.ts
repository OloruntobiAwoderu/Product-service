import { Request, Response, NextFunction } from 'express';
import { successResponse, constants } from '../utils';
import { addProduct, sellProduct, getNonExpiredInventory } from '../services/product.service';
import { IStockUpdateDetail, APIError } from '../types';

const { ADD_ITEM_ERROR, SELL_ITEM_ERROR, FETCH_AVAILABLE_ITEM_ERROR } = constants;

/**
   * A controller function for adding a new inventory item.
   *
   * @static
   * @param { Request } req - The request from the endpoint.
   * @param { Response } res - The response returned by the method.
   * @param { NextFunction } next - Calls the next handler.
   * @returns { Promise< Response | void > } A JSON response that would resolve to an 
   * empty Javascript object for success scenarios or void otherwise.
   */
export const addProductHandler = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { params: { item }, body } = req;
        await addProduct({name: item, ...body});
        logger.info(`Successfully added ${body.quantity} new ${item}(s).`)
        return successResponse(res, {}, 201);
        }
    catch(error) {
        next({ error: ADD_ITEM_ERROR });
    }
}

/**
   * A controller function for adding a new inventory item.
   *
   * @static
   * @param { Request } req - The request from the endpoint.
   * @param { Response } res - The response returned by the method.
   * @param { NextFunction } next - Calls the next handler.
   * @returns { Promise< Response | void > } A JSON response that would resolve to an 
   * empty Javascript object for success scenarios or void otherwise.
   */
  export const sellProductHandler = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { params: { item }, body: { quantity }, items} = req;
    try {
        await sellProduct({ purchaseData: { name: item, quantity }, stockData: items as IStockUpdateDetail });
        logger.info(`Successfully sold ${req.body.quantity} new ${req.params.item}(s).`)
        return successResponse(res, {}, 200);
        }
    catch(error) {
        const {  message } = error;
        const errorObj: APIError = {
            error: SELL_ITEM_ERROR
        };
        const regex = new RegExp(item, 'i');
        if(regex.test(message)) {
            errorObj.statusCode = 400;
            errorObj.error = message;
        } 
        logger.error(`purchase error: ${message}`);
        next(errorObj);
    }
}

/**
   * A controller function for fetching the non-expired quantity of an item from the Inventory.
   *
   * @static
   * @param { Request } req - The request from the endpoint.
   * @param { Response } res - The response returned by the method.
   * @param { NextFunction } next - Calls the next handler.
   * @returns { Promise< Response | void > } A JSON response that would resolve to an 
   * empty Javascript object for success scenarios or void otherwise.
   */
  export const getProductHandler = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const data = await getNonExpiredInventory({ name: req.params.item });
        logger.info(`Successfully found ${data.quantity} non-expired ${req.params.item}(s).`)
        return successResponse(res, data, 200);
        }
    catch(error) {
        next({ error: FETCH_AVAILABLE_ITEM_ERROR });
    }
}