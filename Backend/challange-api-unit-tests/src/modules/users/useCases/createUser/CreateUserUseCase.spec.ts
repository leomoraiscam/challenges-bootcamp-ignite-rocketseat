import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new user', async ()=> {
    const userDataCreate: ICreateUserDTO = {
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    }

    const user = await createUserUseCase.execute(userDataCreate);

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a existent user', async ()=> {
    const userDataCreate: ICreateUserDTO = {
      name: 'user_test_02',
      email: 'emailuserteste_02@email.com',
      password: 'password_123'
    }

    await createUserUseCase.execute(userDataCreate);

    await expect(
      createUserUseCase.execute(userDataCreate)
    ).rejects.toBeInstanceOf(AppError);
  });
});
