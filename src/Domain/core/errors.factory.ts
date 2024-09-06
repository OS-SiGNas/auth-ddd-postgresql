import { HttpStatus } from "./http-status.enum.js";

interface DependencesErr {
  ticket?: string;
  name: string;
  message: string;
  statusCode: HttpStatus;
  issues?: DependencesErr[];
}

export abstract class DomainError extends Error {
  readonly statusCode: HttpStatus;
  override readonly name: string;
  override readonly message: string;
  readonly ticket?: string; // TransactionUuid | number
  readonly issues?: DomainError[];

  protected constructor(d: Readonly<DependencesErr>) {
    super(d.message);
    this.ticket = d.ticket;
    this.name = d.name;
    this.statusCode = d.statusCode;
    this.message = d.message;
    this.issues = d.issues;
  }
}

//  FACTORY ERRORS:

const createError = (name: string) => {
  // return class AbstractError extends ErrorBusiness {
  return class AbstractDomainError extends DomainError {
    constructor(message: string, statusCode: HttpStatus, ticket?: string, issues?: DependencesErr[]) {
      super({ ticket, name, statusCode, message, issues });
    }
  };
};

const createHttpError = (name: string, statusCode: HttpStatus) => {
  return class AbstractDomainError extends DomainError {
    constructor(message: string, ticket?: string, issues?: DependencesErr[]) {
      super({ ticket, name, statusCode, message, issues });
    }
  };
};

/*
 * Example
 * throw new ILambdaError();
 * throw new MyError('SOMETHING WRONG', 500, ticket, issuces)
 
export const MyError = createError('MyError');  */

export const ModuleException = createError("ModuleException");
export const EventException = createError("EventException");
export const QueueException = createError("QueueException");
export const ILambdaException = createError("ILambdaException");
export const ConnectionException = createError("ConnectionException");
export const InvalidJwtPayloadException = createError("InvalidJwtPayloadException");

/* Http Standards
 * Exampple
 * throw new NotFoundError404(`Resource: [ ${uuid} ] NotFound`, ticket, issuces) */

export const BadRequestException400 = createHttpError("BadRequestError", 400);
export const UnauthorizedException401 = createHttpError("UnauthorizedError", 401);
export const PaymentRequiredException402 = createHttpError("PaymentRequiredError", 402);
export const ForbiddenException403 = createHttpError("ForbiddenError", 403);
export const NotFoundException404 = createHttpError("NotFoundError", 404);
export const ConflictException409 = createHttpError("ConflictException", 409);
export const UnprocessableException422 = createHttpError("UnprocessableError", 422);
export const LegalUnavailableException451 = createHttpError("LegalUnavailableError", 451);
export const InternalServerException500 = createHttpError("InternalServerError", 500);
export const UnavailableException503 = createHttpError("UnavailableError", 503);
export const TimeoutException504 = createHttpError("TimeoutError", 504);

export const UserNotFoundException = class extends NotFoundException404 {
  constructor(target: string) {
    super(`User ${target} not found`);
  }
};

export const DuplicateAccountException = class extends ConflictException409 {
  constructor(email: string) {
    super(`Account ${email} already exists`);
  }
};
