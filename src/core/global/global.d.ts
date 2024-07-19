import { ITokenSignedPayload } from "./interface";

declare global {
  namespace Express {
    interface Request {
      user: ITokenSignedPayload | null | undefined;
      vmhealthy: boolean;
    }
  }
}