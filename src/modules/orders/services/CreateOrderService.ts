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
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // Is there any customer with the given ID?
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find customer with the given ID');
    }

    // Are there products with the given ID's?
    const availableProducts = await this.productsRepository.findAllById(
      products,
    );

    // None of them exists
    if (!availableProducts.length) {
      throw new AppError("Could not find products with the given ID's");
    }

    // The unavailable ones
    const availableProductsIds = availableProducts.map(product => product.id);
    const checkUnavailableProducts = products.filter(
      product => !availableProductsIds.includes(product.id),
    );

    if (checkUnavailableProducts.length) {
      // TODO show all the unavailable products
      throw new AppError(
        `Could not find product ${checkUnavailableProducts[0].id}`,
      );
    }

    // Are there products with insufficient quantities?
    // TODO take it to the next level
    const findProductsWithInsufficientQuantities = products.filter(
      product =>
        availableProducts.filter(
          availableProduct => availableProduct.id === product.id,
        )[0].quantity < product.quantity,
    );

    if (findProductsWithInsufficientQuantities.length) {
      throw new AppError(
        `The quantity ${findProductsWithInsufficientQuantities[0].quantity} is not available for ${findProductsWithInsufficientQuantities[0].id}`,
      );
    }

    // Serialize product data
    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: availableProducts.filter(
        avaialbleProduct => avaialbleProduct.id === product.id,
      )[0].price,
    }));

    // Now, create the order
    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    // And subtract quantities on the products
    const { order_products } = order;
    const orderedProductsByQuantity = order_products.map(orderProduct => ({
      id: orderProduct.product_id,
      quantity:
        availableProducts.filter(
          availableProduct => availableProduct.id === orderProduct.product_id,
        )[0].quantity - orderProduct.quantity,
    }));

    await this.productsRepository.updateQuantity(orderedProductsByQuantity);

    return order;
  }
}

export default CreateOrderService;
