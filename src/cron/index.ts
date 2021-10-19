import * as cron from 'node-cron';
import { removeExpiredItems } from '../services/product.service';


export default  (): void => {
    cron.schedule('0 */1 * * *', () => {
        // Remove expired products every one hour.
        logger.info('hourly cron is now running');
        removeExpiredItems();
    });
}
