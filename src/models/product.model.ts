import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import ProductBatch from './product_batch.model';
  
  @Entity({ name: 'products' })
  export default class Product {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column({ nullable: false })
    name: string;
  
    @OneToMany(
      () => ProductBatch,
      (batch) => batch.product,
      {
        nullable: true
      }
    )
    productBatches?: ProductBatch[];
  
    @CreateDateColumn()
    created: Date;
  
    @UpdateDateColumn()
    updated: Date;
  }
  
