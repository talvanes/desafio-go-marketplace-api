import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    // Check whether given email is already registered
    const possibleUser = await this.customersRepository.findByEmail(email);

    if (possibleUser) {
      throw new AppError('Email address already picked up.');
    }

    // Otherwise, just add another client
    const newCustomer = await this.customersRepository.create({
      name,
      email,
    });

    return newCustomer;
  }
}

export default CreateCustomerService;
