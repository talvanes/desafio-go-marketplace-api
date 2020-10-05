import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity()
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  costumer_id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'costumer_id' })
  customer: Customer;

  @OneToMany(() => OrdersProducts, orderProduct => orderProduct.order, {
    cascade: true,
  })
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
