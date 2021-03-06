import { CustomError } from "@dotup/dotup-ts-types";
import { ErrorCodes } from "./ErrorCodes";

export class RouterError extends CustomError<ErrorCodes> {
  private constructor(message: string, code: ErrorCodes) {
    super(message, code);
    this.name = "RouterError";
  }

  static RouterNotInitialized(): RouterError {
    return new RouterError("You've to override initialize().", ErrorCodes.RouterNotInitialized);
  }
}