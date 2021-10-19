import * as winston from "winston";

export type CustomStreamOption = {
    write: (message: string) => winston.Logger
}

export type SellUpdateOrDelete = {
    id: number,
    newQuantity?: number,
    version: number
}

export type FetchItemQuantityResult = {
    quantity: number,
    validTill: number | null
}

export type SellableInventory = {
    productId: number,
    cummulative: number,
    expiry: Date,
    quantity: number,
    id: number,
    version: number
}

export type APIError = {
    error: string,
    statusCode?: number // error handler defaults to 500 if not assigned
}

export type NodeEnv = 'development' | 'test' | 'production';