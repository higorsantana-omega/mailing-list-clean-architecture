import { User, UserData } from '@/entities'
import { UserRepository } from '@/useCases/register-user-on-mailing-list/ports'
import { UseCase } from '@/useCases/ports'

export class RegisterUserOnMailingList implements UseCase {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async perform (request: User): Promise<UserData> {
    const { email, name } = request
    const userData: UserData = { name: name.value, email: email.value }

    const exists = await this.userRepo.exists(userData)
    if (!exists) await this.userRepo.add(userData)

    return userData
  }
}
