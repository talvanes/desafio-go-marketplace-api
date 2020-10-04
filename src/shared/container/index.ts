import { container } from 'tsyringe';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';

// CustomersRepository
container.registerSingleton<ICustomersRepository>(
  'CustomerRepository',
  CustomersRepository,
);

// ProductsRepository
container.registerSingleton<IProductsRepository>(
  'ProductRepository',
  ProductsRepository,
);

// OrdersRepository
container.registerSingleton<IOrdersRepository>(
  'OrderRepository',
  OrdersRepository,
);
