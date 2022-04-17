import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, left } from '@/shared'
import { MailServiceError } from '../errors/mail-service-error'
import { UseCase } from '../ports'
import { EmailOptions, EmailService } from './ports/email-service'

export class SendEmail implements UseCase {
  private readonly emailOptions: EmailOptions
  private readonly emailService: EmailService

  constructor (emailOptions: EmailOptions, emailService: EmailService) {
    this.emailOptions = emailOptions
    this.emailService = emailService
  }

  async perform (userData: UserData):
  Promise<Either<MailServiceError | InvalidNameError | InvalidEmailError, EmailOptions>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(userData)
    if (userOrError.isLeft()) return left(userOrError.value)

    const user = userOrError.value

    const greetings = `E aí <b> ${user.name} </b>, beleza?`
    const customizedHtml = greetings + '<br> <br>' + this.emailOptions.html
    const emailInfo: EmailOptions = {
      ...this.emailOptions,
      to: user.name + '<' + user.email + '>',
      html: customizedHtml
    }

    return await this.emailService.send(emailInfo)
  }
}
