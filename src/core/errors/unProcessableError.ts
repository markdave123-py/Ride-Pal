import { HttpStatus } from "../../core/utils/statuscodes";

import { ApiError, type ErrorDetailsDescriptor } from "./apiErrors";

export class UnProcessableError extends ApiError {
  override _details: ErrorDetailsDescriptor = null;
  _statusCode = HttpStatus.UNPROCESSABLE;
  _message: string;

  constructor(message: string) {
    super(message);
    this._message = message;

    Object.setPrototypeOf(this, UnProcessableError.prototype);
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get message(): string {
    return this._message;
  }

  get details(): ErrorDetailsDescriptor {
    return this._details;
  }
}
