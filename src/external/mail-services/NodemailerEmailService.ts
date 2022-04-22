import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/useCases/errors/mail-service-error'
import { EmailOptions, EmailService } from '@/useCases/send-email/ports/email-service'
import { createTransport } from 'nodemailer'

export class NodemailerEmailService implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    try {
      const transporter = createTransport({
        host: options.host,
        port: options.port,
        auth: {
          user: options.username,
          pass: options.password
        }
      })
      await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachment
      })
      return right(options)
    } catch (error) {
      return left(new MailServiceError())
    }
  }
}
