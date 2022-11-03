import HttpResponse from './response.http';

export default class NoContentResponse extends HttpResponse {
  constructor(data: any = null) {
    super(data, 204, 'no content');
  }
}
