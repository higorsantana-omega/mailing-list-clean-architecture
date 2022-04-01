import { UserData } from '../../entities/user-data'
import { RegisterUserOnMailingList } from '../register-user-on-mailing-list'
import { UserRepository } from './ports/user-repository'
import { InMemoryUserRepository } from './repository/in-memory-user-repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const response = await useCase.registerUserOnMailingList({ name, email })
    const user = await repo.findUserByEmail(email)
    expect(user.name).toBe(name)
    expect(response.value.name).toBe(name)
  })
})
