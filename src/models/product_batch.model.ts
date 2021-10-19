import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    JoinColumn
  } from 'typeorm';
  import Product from './product.model';
  
  
  @Entity({ name: 'product_batches' })
  export default class ProductBatch {
    @PrimaryColumn()
    id?: number;
  
    @Column({ nullable: false })
    quantity: number;
  
    @ManyToOne(
      () => Product,
      (product) => product.productBatches,
      { cascade: ['update'] }
    )
    @JoinColumn({ name: 'product_id' })
    product: Product;
  
    @Column({ nullable: true })
    expiry: Date;

    @Column({ default: 0 })
    version?: number;
  
    @CreateDateColumn()
    created: Date;
  }
  