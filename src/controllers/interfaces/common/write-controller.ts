import RequestHandler from "./request-handler";

export default interface WriteController {
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}
