export class NotFoundError extends Error {
  digest = 'NEXT_NOT_FOUND';
  constructor() {
    super('NEXT_NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export function notFound(): never {
  throw new NotFoundError();
}

export default { notFound };
