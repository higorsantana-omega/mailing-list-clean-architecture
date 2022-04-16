import { Either, Right, right } from '@/shared'
import { MailServiceError } from '@/useCases/errors/mail-service-error'
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

class MailServiceStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

describe('Send email to user', () => {
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const response = await useCase.perform({ name: toName, email: toEmail })
    expect(response).toBeInstanceOf(Right)
  })
})
