import {  Response } from 'express';
import { getManager, Repository, EntityTarget } from 'typeorm';
import { ObjectSchema } from 'joi';
import constants from './constants';
import { ISyncValidationResult } from '../types';

/**
 * A custom error response handler.
 * @param { Response } res -  A HTTP response object for a specific request.
 * @param {Record<string, unknown>} data - The response payload to be sent for a corresponding request.
 * @param {number} code - The response status code, 200 is the default if non is assigned.
 * @return { Response } A HTTP response object for a specific request.
 */

const successResponse = (res: Response, data: Record<string, unknown>, code = 200): Response => res.status(code).json(data);

/**
 * A custom error response handler.
 * @param { Response } res -  A HTTP response object to a specific request.
 * @param {string} error - The error message that describes what when wrong
 * whilst processing the request. It has a default value whenever non is set.
 * @param {number} statusCode - The HTTP status code representing the error.
 * defaults to 500 if non is set.
 * @return { Response } A HTTP response object for a specific request.
 */

const errorResponse = (res: Response, error: string, statusCode = 500): Response =>
  res.status(statusCode).json({ error: error || constants.INTERNAL_SERVER_ERROR });


/**
 * Validates some data against a pre-defined schema asynchronously.
 * @param { ObjectSchema<T> } schema -  The pre-defined schema used to determine the validation rules.
 * @param { T } data - The payload to be validated, an ideal payload would match the schema definition.
 * @return { Promise<T> } Returns a normalized data where required.
 * @throws { Error } Throws an error with a message that described the defective field.
 */

const validationHandlerAsync = async<T>(schema: ObjectSchema<T>, data: T): Promise<T> => {
    try {
        const value = await schema.validateAsync(data);
        return value as T;
    } catch(error){
        throw new Error(error?.details[0].message);
    }
}

/**
 * Validates some data against a pre-defined schema asynchronously.
 * @param { ObjectSchema<T> } schema -  The pre-defined schema used to determine the validation rules.
 * @param { T } data - The payload to be validated, an ideal payload would match the schema definition.
 * @return { Promise<T> } Returns a normalized data where required.
 * @throws { Error } Throws an error with a message that described the defective field.
 */

const validationHandlerSync = <T>(schema: ObjectSchema<T>, data: T): ISyncValidationResult<T> => {
        const { value, error } = schema.validate(data);
        if(error) throw new Error(error?.details[0].message);
        return {
            value
        }
}

/**
 * Converts a truthy value like a 'yes' or 'true' to true and any other string to false. 
 * It also converts parameters of other data types to their boolean equivalent
 * @param { T } data - The payload to be validated, an ideal payload would match the schema definition.
 * @return { boolean } Returns a true or false value.
 */

const toBoolean = (data: unknown): boolean => {
    let boolResult: boolean;
    boolResult = Boolean(data);
    if(typeof data === 'string') {
        const booly = data.toLowerCase();
        boolResult = booly === 'true' || booly === 'yes'
    }
    return boolResult;
}

/**
 * Get's the repository for a specific entity.
 * @param { EntityTarget<M> } model -  The pre-defined schema used to determine the validation rules.
 * @return { Repository<M> } Returns a repository for a specific entity.
 */

const getRepository = <M>(model: EntityTarget<M>): Repository<M> => getManager().getRepository(model);


  export {
      successResponse,
      errorResponse,
      validationHandlerAsync,
      validationHandlerSync,
      toBoolean,
      getRepository
  }