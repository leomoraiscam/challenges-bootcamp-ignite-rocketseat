import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it('should be able to return statement by specific user', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    });


    await inMemoryStatementsRepository.create({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit R$ 10.00'
    });

    await inMemoryStatementsRepository.create({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit R$ 10.00'
    });

    const statement = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });

    expect(statement).toMatchObject({
      balance: expect.any(Number),
      statement: expect.any(Array)
    });
  });

  it('should not be able to return statement of user not existent', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    });

    await inMemoryStatementsRepository.create({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit R$ 10.00'
    });

    await inMemoryStatementsRepository.create({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit R$ 10.00'
    });

    await expect(
      getBalanceUseCase.execute({
        user_id: 'not-existent',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
