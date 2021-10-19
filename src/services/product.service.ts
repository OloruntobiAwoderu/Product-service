import { getRepository, constants } from '../utils';
import { Product, ProductBatch } from '../models';
import { IAddProductDTO, ISellQuantityDTO, ISellableStockDTO } from '../dtos';
import { getManager } from 'typeorm';
import { FetchItemQuantityResult, SellableInventory, ISellUpdateOrDeleteResponse, IStockUpdateDetail } from '../types';
import { fetchSellableStockOrderByQuantity } from '../database/queries';

const { RACE_CONDITION, notAvailableMsg, moreThanAvailableMsg, funnyRaceWarning } = constants;

/**
 * Adds a new batch of an item to the inventory DB.
 * @param { IAddProductDTO } data - The details required to add a new item.
 * @returns { Promise<void> }
 * @throws { Error } Throws an error if something breaks while interacting with the DB.
 */
export const addProduct = async(data: IAddProductDTO): Promise<void> => {
    try {
        const productRepository = getRepository(Product);
        const productBatchRepository = getRepository(ProductBatch);
        const productBatch = new ProductBatch();
        productBatch.quantity = data.quantity;
        productBatch.expiry = new Date(data.expiry);
        let product = await productRepository.findOne({
            where: {
                name: data.name.toLowerCase()
            }
        });
        if(product) {
            product.updated = new Date();
            productBatch.product = product;
            await productBatchRepository.createQueryBuilder()
        .insert()
        .into(ProductBatch)
        .values(productBatch)
        .onConflict(`ON CONSTRAINT "product_id_expiry_uq" DO UPDATE SET quantity = "product_batches".quantity + :q, version = 0`)
        .setParameter('q', productBatch.quantity)
        .execute();
        } else {
            product = new Product();
            product.name = data.name.toLowerCase();
            productBatch.product = product;
            await getManager().transaction('SERIALIZABLE', async transactionalEntityManager => {
                product = await transactionalEntityManager.save(product);
                await transactionalEntityManager.save(productBatch);
            });
        }
    } catch(error) {
        const { message } = error;
        logger.error(`Failed to add a new product batch: ${message}`);
        throw new Error(message);
    }
}

/**
 * Fetches all non-expired batch of an item in the order of expiry and available quantity.
 * @param { ISellQuantityDTO } data - The details required to fetch a specific quantity of an item.
 * @returns { Promise<ISellUpdateOrDeleteResponse> }
 * @throws { Error } Throws an error if something breaks while interacting with the DB.
 */
export const getSellableInventory = async({ quantity, name }: ISellQuantityDTO): Promise<ISellUpdateOrDeleteResponse> => {
        const productBatchRepository = getRepository(ProductBatch);
        const data: SellableInventory[] = await productBatchRepository.query(fetchSellableStockOrderByQuantity, [quantity, name.toLowerCase()]);
        
        const result: ISellUpdateOrDeleteResponse = {
            error: notAvailableMsg(name)
        }
        if(data.length){
            const lastLot = data[data.length - 1];
            if(lastLot.cummulative < quantity) {
                result.error = moreThanAvailableMsg(lastLot.cummulative as number, name)
            } else {
                result.data = data.reduce((acc: IStockUpdateDetail, batch) => {
                    if(batch.cummulative <= quantity) acc.delete.push({
                        id: batch.id,
                        version: batch.version
                    })
                    else acc.update.push({
                        id: batch.id,
                        newQuantity: batch.cummulative - quantity,
                        version: batch.version
                    })
                    return acc;
                }, {delete: [], update: []} as IStockUpdateDetail);
                delete result.error;
            }
        }
        return result;
}

/**
 * Adds a new batch of an item to the inventory DB.
 * @param { SellableStockDTO } data - The details required to add a new item.
 * @returns { Promise<void> }
 * @throws { Error } Throws an error if something breaks while interacting with the DB.
 */
export const sellProduct = async({ purchaseData, stockData }: ISellableStockDTO, attempts = 3): Promise<void> => {
    try {
        await getManager().transaction('SERIALIZABLE', async transactionalEntityManager => {
            for await (const batch of stockData.delete) {
                const { affected } =  await transactionalEntityManager.delete(ProductBatch, {
                    id: batch.id,
                    version: batch.version
                });
                if(!affected) throw new Error(RACE_CONDITION);
            }
            for await (const batch of stockData.update) {
                const { affected } =  await transactionalEntityManager.update(ProductBatch, {
                    id: batch.id,
                    version: batch.version
                },
                {
                    quantity: batch.newQuantity,
                    version: batch.version + 1
                }
                );
                if(!affected) throw new Error(RACE_CONDITION);
            }
        });
        }
    catch(error) {
        const { message } = error;
        let finalError = message;
        if(message === RACE_CONDITION) {
            const remainingAttempts = attempts - 1;
            logger.warn(funnyRaceWarning(remainingAttempts));
                const response = await getSellableInventory(purchaseData);
                if(!response.error) return sellProduct({ purchaseData, stockData: response.data as IStockUpdateDetail}, remainingAttempts);
                finalError = response.error;
        }
        throw new Error(finalError);
    }
}

/**
 * Fetches a sum of the quantity of an item that is not expired as well as the nearest expiry date.
 * @param { Partial<IAddProductDTO> } data - The details required to fetch a specific item.
 * @returns { Promise<FetchItemQuantityResult> }
 * @throws { Error } Throws an error if something breaks while interacting with the DB.
 */
export const getNonExpiredInventory = async({ name }: Partial<IAddProductDTO>): Promise<FetchItemQuantityResult> => {
try {
    const productBatchRepository = getRepository(ProductBatch);
    let result = await productBatchRepository.createQueryBuilder('batch')
    .select('SUM(batch.quantity) OVER()', 'total')
    .addSelect('batch.expiry', 'expiry')
    .leftJoinAndSelect('batch.product', 'product')
    .groupBy('batch.quantity')
    .addGroupBy('product.id')
    .addGroupBy('batch.expiry')
    .where('product.name = :productName', {productName: name?.toLowerCase() })
    .andWhere('batch.expiry > NOW()')
    .getRawOne();
    if(result){
        result = {
            quantity: +result.total,
            validTill: new Date(result.expiry).getTime()
        }
    }else {
        result = {
            quantity: 0,
            validTill: null
        }
    }
    return result;
}catch(error) {
    const { message } = error;
    logger.error(`Failed to fetch available items: ${message}`);
    throw new Error(message);
}     
}

/**
 * Removes expired item batch from the inventory.
 * @returns { Promise<void> }
 */
export const removeExpiredItems = async(): Promise<void> => {
    try {
        const productBatchRepository = getRepository(ProductBatch);
        await productBatchRepository.createQueryBuilder()
        .delete()
        .where('expiry <= NOW()')
        .execute();
        logger.info('Successfully deleted expired items from DB');
    }catch(error) {
        logger.warn(`Something seems to be causing the deletion of expired item to fail: ${error.message}.`);
    }     
}