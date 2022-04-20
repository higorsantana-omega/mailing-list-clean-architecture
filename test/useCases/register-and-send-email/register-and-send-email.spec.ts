import { UserData } from '@/entities'
import { Either, right } from '@/shared'
import { RegisterUserOnMailingList } from '@/useCases'
import { MailServiceError } from '@/useCases/errors/mail-service-error'
import { RegisterAndSendEmail } from '@/useCases/register-and-send-email/register-and-send-email'
import { UserRepository } from '@/useCases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/useCases/register-user-on-mailing-list/repository'
import { EmailOptions, EmailService } from '@/useCases/send-email/ports/email-service'
import { SendEmail } from '@/useCases/send-email/send-email'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'Test'
const fromEmail = 'from_mail@mail.com'
const toName = 'any_name'
const toEmail = 'any_mail@mail.com'
const subject = 'Test e-mail'
const emailBody = 'Hello World'
const emailBodyHtml = '<b>Hello world</b>'
const attachment = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: fromName + ' ' + fromEmail,
  to: toName + '<' + toEmail + '>',
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachment
}

class MailServiceMock implements EmailService {
  public timeSendWasCalled = 0
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    this.timeSendWasCalled++
    return right(emailOptions)
  }
}

describe('Register and send email to user', () => {
  test('should register user and send him/her an email with cvalid data', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)

    const name = 'any_name'
    const email = 'any@email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name, email })).value as UserData
    const user = await repo.findUserByEmail(email)

    expect(user.name).toBe(name)
    expect(mailServiceMock.timeSendWasCalled).toEqual(1)
    expect(response.name).toBe(name)
    expect(response.email).toBe(email)
  })

  test('should not register user and send him/her an email with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)

    const name = 'any_name'
    const invalidEmail = 'invalid_email'
    const response = (await registerAndSendEmailUseCase.perform({ name, email: invalidEmail })).value as UserData
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not register user and send him/her an email with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)

    const invalidName = 'i'
    const email = 'any@mail.com'
    const response = (await registerAndSendEmailUseCase.perform({ name: invalidName, email })).value as UserData
    expect(response.name).toEqual('InvalidNameError')
  })
})
