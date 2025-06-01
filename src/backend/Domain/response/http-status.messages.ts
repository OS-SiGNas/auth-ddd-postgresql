import { HttpStatus } from "./http-status.enum.js";

export type GetHttpMessage = (status: HttpStatus) => string;

export const getHttpMessage: GetHttpMessage = (() => {
	const messages = new Map<HttpStatus, string>()
		// Info
		.set(HttpStatus.CONTINUE, "Continuing...  🔄")
		.set(HttpStatus.SWITCHING_PROTOCOLS, "Switching protocols...  🤝")
		.set(HttpStatus.PROCESSING, "Processing... ⏳")
		.set(HttpStatus.EARLYHINTS, "Early hints... 💡")

		// Success
		.set(HttpStatus.OK, "Success! ✅")
		.set(HttpStatus.CREATED, "Created! 🎉")
		.set(HttpStatus.ACCEPTED, "Accepted 👍")
		.set(HttpStatus.NON_AUTHORITATIVE_INFORMATION, "Non-authoritative information ℹ️")
		.set(HttpStatus.NO_CONTENT, "No content 😶")
		.set(HttpStatus.RESET_CONTENT, "Content reset 🔄")
		.set(HttpStatus.PARTIAL_CONTENT, "Partial content 📦")

		// Redirect
		.set(HttpStatus.AMBIGUOUS, "Multiple choices❓")
		.set(HttpStatus.MOVED_PERMANENTLY, "Moved permanently ➡️")
		.set(HttpStatus.FOUND, "Found 📍")
		.set(HttpStatus.SEE_OTHER, "See other 👁️")
		.set(HttpStatus.NOT_MODIFIED, "Not modified 🔄")
		.set(HttpStatus.TEMPORARY_REDIRECT, "Temporary redirect ⏱️")
		.set(HttpStatus.PERMANENT_REDIRECT, "Permanent redirect ➡️")

		// Client Errors
		.set(HttpStatus.BAD_REQUEST, "⚠️ Bad request ⚠️")
		.set(HttpStatus.UNAUTHORIZED, "🔒 Unauthorized  🔒")
		.set(HttpStatus.PAYMENT_REQUIRED, "💳  Payment required  💳")
		.set(HttpStatus.FORBIDDEN, "🚫 Forbidden 🚫")
		.set(HttpStatus.NOT_FOUND, "Resource not found 🔍")
		.set(HttpStatus.METHOD_NOT_ALLOWED, "Method not allowed ⛔")
		.set(HttpStatus.NOT_ACCEPTABLE, "Not acceptable ❌")
		.set(HttpStatus.PROXY_AUTHENTICATION_REQUIRED, "Proxy authentication required 🔑")
		.set(HttpStatus.REQUEST_TIMEOUT, "Request timeout ⌛")
		.set(HttpStatus.CONFLICT, "Conflict with the current state of the resource 💥")
		.set(HttpStatus.GONE, "Resource deleted 🗑️")
		.set(HttpStatus.LENGTH_REQUIRED, "Length required 📏")
		.set(HttpStatus.PRECONDITION_FAILED, "Precondition failed ❌")
		.set(HttpStatus.PAYLOAD_TOO_LARGE, "Payload too large ➡️")
		.set(HttpStatus.URI_TOO_LONG, "URI too long ➡️")
		.set(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported media type ❌")
		.set(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE, "Requested range not satisfiable ❌")
		.set(HttpStatus.EXPECTATION_FAILED, "Expectation failed 😢")
		.set(HttpStatus.I_AM_A_TEAPOT, "I'm a teapot ☕ (Unusual error)")
		.set(HttpStatus.MISDIRECTED, "Misdirected request 🧭")
		.set(HttpStatus.UNPROCESSABLE_ENTITY, "Unprocessable content, fix request and try again ️ 🛠️")
		.set(HttpStatus.FAILED_DEPENDENCY, "Failed dependency ❌")
		.set(HttpStatus.PRECONDITION_REQUIRED, "Precondition required  🔑")
		.set(HttpStatus.TOO_MANY_REQUESTS, "Too many requests  🚦🛑")
		.set(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS, "Unavailable for legal reasons ⚖️")

		// Server Errors
		.set(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error ️ 🖥️💥")
		.set(HttpStatus.NOT_IMPLEMENTED, "Not implemented  🚧")
		.set(HttpStatus.BAD_GATEWAY, "Bad gateway 🚪❌")
		.set(HttpStatus.SERVICE_UNAVAILABLE, "Service unavailable ⏳ Try later")
		.set(HttpStatus.GATEWAY_TIMEOUT, "Gateway timeout ⌛")
		.set(HttpStatus.HTTP_VERSION_NOT_SUPPORTED, "HTTP version not supported ❌");

	return (status: HttpStatus) => {
		const message = messages.get(status);
		if (!message) throw new Error("Http message no implemented");
		return message;
	};
})();
