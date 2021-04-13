import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Statement', () => {
  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able to return statement specific by user', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit R$ 10.00'
    });

    const findSpecificStatamentByUser = await getStatementOperationUseCase.execute({
      user_id: String(user.id),
      statement_id: String(statement.id)
    });

    expect(findSpecificStatamentByUser).toHaveProperty('id');
    expect(findSpecificStatamentByUser.user_id).toBe(user.id);
  });


  it('should not be able to return statement user non exist', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit R$ 10.00'
    });


    await expect(
      getStatementOperationUseCase.execute({
        user_id: 'user-non-exist',
        statement_id: String(statement.id)
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to return statement non exist', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit R$ 10.00'
    });


    await expect(
      getStatementOperationUseCase.execute({
        user_id: String(user.id),
        statement_id: 'statement-non-exist'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
