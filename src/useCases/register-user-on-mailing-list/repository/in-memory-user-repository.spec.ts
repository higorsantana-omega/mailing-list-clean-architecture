import { InMemoryUserRepository } from './in-memory-user-repository'
import { UserData } from '../user-data'

describe('In memory user repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepo = new InMemoryUserRepository(users)
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  test('should return user if it is found in the repository', async () => {
    const users: UserData[] = []
    const name = 'any-name'
    const email = 'any@email.com'
    const userRepo = new InMemoryUserRepository(users)
    await userRepo.add({ name, email })
    const user = await userRepo.findUserByEmail(email)
    expect(user.name).toBe(name)
  })

  test('should return all users in repository', async () => {
    const users: UserData[] = [
      { name: 'any_name', email: 'any@email.com' },
      { name: 'second_name', email: 'second@email.com' }
    ]
    const userRepo = new InMemoryUserRepository(users)
    const returnedUsers = await userRepo.findAllUsers()
    expect(returnedUsers).toHaveLength(2)
  })
})
