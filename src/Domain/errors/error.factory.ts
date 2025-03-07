import { HttpStatus } from "../response/http-status.enum.js";

import type { UUID } from "node:crypto";

export type Ticket = string | UUID | undefined;

interface DependencesException extends ErrorOptions {
	ticket?: Ticket;
}

export abstract class DomainException extends Error {
	public abstract code: HttpStatus;
	public abstract ticket: Ticket;
	protected constructor(message: string, d?: DependencesException) {
		super(message, d?.cause !== undefined ? { cause: d?.cause } : undefined);
	}
}

interface PayloadFactory {
	name: string;
	code?: HttpStatus;
	defaultMessage?: string;
}

type ExceptionsFactory = (p: PayloadFactory) => new (message: string, d?: DependencesException) => DomainException;
const createException: ExceptionsFactory = ({ name, code, defaultMessage }) => {
	return class extends DomainException {
		public override code: number;
		public override ticket: Ticket;
		constructor(message: string, d?: DependencesException) {
			if (defaultMessage === undefined) super(message, d);
			else super(defaultMessage.replace("[replace]", message), d);
			this.name = name;
			this.code = code ?? HttpStatus.INTERNAL_SERVER_ERROR;
			this.ticket = d?.ticket;
		}
	};
};

/*
 * Example
 * throw new ILambdaException();
 * throw new MyException({ message: 'SOMETHING WRONG', ticket, issuces })

export const MyException = createException({ name: 'MyException' });  */
export const ModuleException = createException({ name: "ModuleException" });
export const EventException = createException({ name: "EventException" });
export const QueueException = createException({ name: "QueueException" });
export const LambdaException = createException({ name: "LambdaException" });
export const ConnectionException = createException({ name: "ConnectionException" });

/* Http Standards
 * Exampple
 * throw new BadRequestException400({ message: "param invalid", ticket: requestId, issuces }) */

export const BadRequestException400 = createException({ name: "BadRequestException", code: HttpStatus.BAD_REQUEST });
export const UnauthorizedException401 = createException({ name: "UnauthorizedException", code: HttpStatus.UNAUTHORIZED });
export const PaymentRequiredException402 = createException({ name: "PaymentRequiredException", code: HttpStatus.PAYMENT_REQUIRED });
export const ForbiddenException403 = createException({ name: "ForbiddenException", code: HttpStatus.FORBIDDEN });

/** @constructor @param message Specify the resource id, it will be replaced with a default string */
export const NotFoundException404 = createException({
	name: "NotFoundException",
	defaultMessage: "Resource [replace] not found",
	code: HttpStatus.NOT_FOUND,
});

export const ConflictException409 = createException({ name: "ConflictException", code: HttpStatus.CONFLICT });

/** @constructor @param message Specify the account, it will be replaced with a default string */
export const DuplicateAccountException409 = createException({
	name: "DuplicateAccountException",
	defaultMessage: "Account [replace] already exists",
	code: HttpStatus.CONFLICT,
});

export const UnprocessableException422 = createException({ name: "UnprocessableException", code: HttpStatus.UNPROCESSABLE_ENTITY });

export const UnavailableForLegalException451 = createException({
	name: "LegalUnavailableException",
	code: HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
});

export const InternalServerException500 = createException({ name: "InternalServerException" });
export const ServiceUnavailableException503 = createException({ name: "UnavailableException", code: HttpStatus.SERVICE_UNAVAILABLE });
export const GatewayTimeoutException504 = createException({ name: "GatewayTimeoutException", code: HttpStatus.GATEWAY_TIMEOUT });
