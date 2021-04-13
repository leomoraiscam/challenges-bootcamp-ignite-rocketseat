import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able to create a statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    });

    const statement = await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit R$ 10.00'
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to deposit a statement for user non existent', async () => {
    const statement =

    await expect(
      createStatementUseCase.execute({
        user_id: 'user-not-existent',
        type: OperationType.DEPOSIT,
        amount: 10,
        description: 'deposit R$ 10.00'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able withdraw if amount is greater than the balance contained in the account', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test_02',
      email: 'emailuserteste_02@email.com',
      password: 'password_123'
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'DEPOSIT R$ 10.00'
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'DEPOSIT R$ 10.00'
    });

    await expect(
      createStatementUseCase.execute({
        user_id: String(user.id),
        type: OperationType.WITHDRAW,
        amount: 100,
        description: 'WITHDRAW R$ 100.00'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
