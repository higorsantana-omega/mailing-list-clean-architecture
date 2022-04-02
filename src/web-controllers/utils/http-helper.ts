import { HttpResponse } from '../ports'

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
