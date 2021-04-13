import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { AppError } from '../../../../shared/errors/AppError';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able return an user by id', async () => {
    const userDataCreate: ICreateUserDTO = {
      name: 'user_test_01',
      email: 'emailuserteste@email.com',
      password: 'password_123'
    }

    const user = await inMemoryUsersRepository.create(userDataCreate);

    const user_id = String(user.id);

    const listUser = await showUserProfileUseCase.execute(user_id)

    expect(listUser.name).toBe('user_test_01');
    expect(listUser.email).toBe('emailuserteste@email.com');
  });

  it('should not be able return an user non-existent', async () => {
    const user_id = 'non-exist-user';

    await expect(
      showUserProfileUseCase.execute(user_id)
    ).rejects.toBeInstanceOf(AppError);
  });
});
