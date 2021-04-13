import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AppError } from '../../../../shared/errors/AppError'

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to authenticate user', async() => {
    const user: ICreateUserDTO = {
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    }

    await createUserUseCase.execute(user);

    const authentication = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(authentication).toHaveProperty('token');
  });

  it('should not be able to authenticate user with invalid credentials', async() => {
    const user: ICreateUserDTO = {
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    }

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with user a non-existent', async() => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'email-non-existing',
        password: 'password-non-existing'
      })
    ).rejects.toBeInstanceOf(AppError);
  })
});
