import { IncomingHttpHeaders } from 'http'
import { Request } from 'express'

interface CustomHeaders {
  csrfnonce?: string;
}
export interface CustomRequest extends Request {
  body: any
  headers: IncomingHttpHeaders & CustomHeaders
}
