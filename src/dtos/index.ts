import { IStockUpdateDetail } from '../types';

export interface ISellQuantityDTO{
    /**
    * The quantity of the item.
    */
    quantity: number;
     /**
     * The name of the inventory item.
     */
    name: string;
}

export interface IAddProductDTO extends ISellQuantityDTO {
    /**
     * The expiry date of the batch in milliseconds-since-epoch.
     */
    expiry: number;
}

export interface ISellableStockDTO  {
    purchaseData: ISellQuantityDTO;
    stockData: IStockUpdateDetail;
}