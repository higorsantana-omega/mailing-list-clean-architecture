import { User, UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/useCases'
import { UserRepository } from '@/useCases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/useCases/register-user-on-mailing-list/repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const user = User.create({ name, email }).value as User
    const response = await useCase.perform(user)
    const addedUser = await repo.findUserByEmail(email)
    expect(addedUser.name).toBe(name)
    expect(response.name).toBe(name)
  })
})
