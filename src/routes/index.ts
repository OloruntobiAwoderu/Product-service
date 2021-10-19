import { Router } from 'express';
import swaggerUI from 'swagger-ui-express';
import apiDocs from '../../swagger.json';
import { addProductHandler, sellProductHandler, getProductHandler } from '../controllers/product.controller';
import { sellableItemCheck, dataValidator } from '../middlewares';
import { sellProductSchema, addProductSchema } from '../validations/product.schema';

const router = Router();

// Add a new item
router.post('/:item/add', dataValidator(addProductSchema) ,addProductHandler);
// Sell a quantity of an item
router.post('/:item/sell', dataValidator(sellProductSchema), sellableItemCheck, sellProductHandler);
// Fetch the available quantity of an item
router.get('/:item/quantity', getProductHandler);
// The API docs
router.use('/api-docs', swaggerUI.serve);
router.get('/api-docs', swaggerUI.setup(apiDocs));


export default router;