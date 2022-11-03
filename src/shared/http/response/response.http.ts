export default abstract class HttpResponse {
  constructor(
    public readonly data: any,
    public readonly statusCode: number,
    public readonly status: string,
  ) {
    if (data && !(typeof data === 'object' && !Array.isArray(data))) {
      throw new Error('Data must be type of Object!');
    }
  }
}
