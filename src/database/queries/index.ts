export const fetchSellableStockOrderByQuantity = `
SELECT *
FROM (SELECT pb.id, pb.quantity, pb.product_id as "productId", pb.expiry, pb.version,
             SUM(pb.quantity) OVER (ORDER BY pb.expiry, pb.quantity ASC) AS cummulative
      FROM product_batches pb
      INNER JOIN products p on p.id = pb.product_id
      WHERE pb.expiry > NOW() AND p.name = $2
     ) as cte
WHERE cte.cummulative - cte.quantity < $1;
`;
