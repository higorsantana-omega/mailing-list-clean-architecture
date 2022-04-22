import { NodemailerEmailService } from '@/external/mail-services'
import { MailServiceError } from '@/useCases/errors/mail-service-error'
import { EmailOptions } from '@/useCases/send-email/ports/email-service'

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

jest.mock('nodemailer')
const nodemailer = require('nodemailer')
const sendMailMock = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('Nodemailer mail service adapter', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('should return ok if email is sent', async () => {
    const nodemailer = new NodemailerEmailService()
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toEqual(mailOptions)
  })

  test('should return error if email is not send', async () => {
    const nodemailer = new NodemailerEmailService()
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toBeInstanceOf(MailServiceError)
  })
})
