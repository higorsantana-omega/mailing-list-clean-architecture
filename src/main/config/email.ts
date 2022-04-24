import { EmailOptions } from '@/useCases/send-email/ports/email-service'

const attachment = [{
  filename: 'text.txt',
  path: '../../resources/text.txt'
}]

export default function getEmailOptions (): EmailOptions {
  const text = 'Texto da mensagem'
  return {
    from: 'Higor Santana | <higor@mail.com>',
    to: '',
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    subject: 'Test message',
    text,
    html: `<b>${text}</b>`,
    attachment
  }
}
