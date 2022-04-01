import { InvalidEmailError } from '../../entities/errors/invalid-email-error'
import { InvalidNameError } from '../../entities/errors/invalid-name-error'
import { UserData } from '../../entities/user-data'
import { left } from '../../shared/either'
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

  test('should not add user with invalid email to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'invalid-email'
    const response = await useCase.registerUserOnMailingList({ name, email })
    const user = await repo.findUserByEmail(email)
    expect(user).toBeNull()
    expect(response).toEqual(left(new InvalidEmailError()))
  })

  test('should not add user with invalid name to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = ''
    const email = 'any@email.com'
    const response = await useCase.registerUserOnMailingList({ name, email })
    const user = await repo.findUserByEmail(email)
    expect(user).toBeNull()
    expect(response).toEqual(left(new InvalidNameError()))
  })
})
