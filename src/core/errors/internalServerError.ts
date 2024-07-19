import { HttpStatus } from "../../core/utils/statuscodes";
import { ApiError, type ErrorDetailsDescriptor } from "./apiErrors";

export class InternalServerError extends ApiError {
  _statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  _message: string;
  _details = null;

  constructor(message: string) {
    super(message);
    this._message = message;

    Object.setPrototypeOf(this, InternalServerError.prototype);
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
