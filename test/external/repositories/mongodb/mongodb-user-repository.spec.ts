import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

describe('Mongodb user repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('when user is added, it should exist', async () => {
    const userRepositoy = new MongodbUserRepository()
    const user = {
      name: 'any_name',
      email: 'any@mail.com'
    }
    await userRepositoy.add(user)
    expect(await userRepositoy.exists(user)).toBeTruthy()
  })

  test('should return all added users', async () => {
    const userRepositoy = new MongodbUserRepository()
    await Promise.all([
      userRepositoy.add({
        name: 'any_name',
        email: 'any@mail.com'
      }),
      userRepositoy.add({
        name: 'second_name',
        email: 'second@mail.com'
      })
    ])
    const users = await userRepositoy.findAllUsers()
    expect(users[0].name).toEqual('any_name')
    expect(users[1].name).toEqual('second_name')
  })
})
