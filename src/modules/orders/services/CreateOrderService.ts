import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrderRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomerRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // Is it an invalid costumer?
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Such costumer does not exist.');
    }

    // TODO Are there any invalid products?
    // TODO Are there products with insufficient quantities?

    // Create order (don't forget to subtract quantities)
    const updatedProducts = await this.productsRepository.updateQuantity(
      products,
    );

    const orderProducts = updatedProducts.map(product => ({
      product_id: product.id,
      price: product.price,
      quantity: product.quantity,
    }));

    const newOrder = await this.ordersRepository.create({
      customer,
      products: orderProducts,
    });

    return newOrder;
  }
}

export default CreateOrderService;
