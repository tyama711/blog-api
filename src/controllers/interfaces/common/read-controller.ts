import RequestHandler from './request-handler'

export default interface ReadController {
  retrieve: RequestHandler
  findOne: RequestHandler
}
