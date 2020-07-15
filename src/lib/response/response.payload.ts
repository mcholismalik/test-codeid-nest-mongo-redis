export class ResponsePayload {
  message?: string = ''
  data?: any = {}
  statusCode?: number

  constructor(message?: string, data?: any, statusCode?: number) {
    if (message) this.message = message
    if (data) this.data = data
    if (statusCode) this.statusCode = statusCode
  }
}
