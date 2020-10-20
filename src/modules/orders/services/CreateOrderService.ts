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
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Invalid user id');
    }

    const productsList = await this.productsRepository.findAllById(products);
    const allProductsFounded = products.every(findProduct => {
      const existsInProductsList = productsList.some(
        value => value.id === findProduct.id,
      );

      return existsInProductsList;
    });

    if (!allProductsFounded) {
      throw new AppError('All products should be registered');
    }

    const allProductsHaveSufficientQuantity = products.every(findProduct => {
      const product = productsList.find(value => value.id === findProduct.id);

      return findProduct.quantity <= (product?.quantity || 0);
    });

    if (!allProductsHaveSufficientQuantity) {
      throw new AppError('All products should have sufficient quantities');
    }

    const createOrderProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price:
        productsList.find(findProduct => findProduct.id === product.id)
          ?.price || 0,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: createOrderProducts,
    });

    const updatedProducts = productsList.map(findProduct => {
      const product = products.find(value => value.id === findProduct.id);

      return {
        id: findProduct.id,
        quantity: findProduct.quantity - (product?.quantity || 0),
      };
    });

    await this.productsRepository.updateQuantity(updatedProducts);

    return order;
  }
}

export default CreateOrderService;
