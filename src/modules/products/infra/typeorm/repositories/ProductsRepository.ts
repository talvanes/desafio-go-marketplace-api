import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // Extract id's
    const product_ids = products.map(product => product.id);

    // Do the finding
    const findProducts = await this.ormRepository.find({
      where: {
        id: In(product_ids),
      },
    });

    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // Extract id's
    const product_ids = products.map(product => product.id);

    // Intermediate DTO object to grab info from
    const productsDtoData: Record<
      string,
      { quantity: number }
    > = products.reduce(
      (dataset, product) =>
        Object.assign(dataset, {
          [product.id]: { quantity: product.quantity },
        }),
      {},
    );

    // Find products inside the catalog
    const findProducts = await this.ormRepository.find({
      where: In(product_ids),
    });

    // Now, update product info
    const foundProductsToUpdate = findProducts.map(product => ({
      ...product,
      quantity: product.quantity + productsDtoData[product.id].quantity,
    }));

    return this.ormRepository.save(foundProductsToUpdate);
  }
}

export default ProductsRepository;
