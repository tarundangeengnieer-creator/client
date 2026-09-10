/**
 * ASHIELDER Normalized Domain Error Classes
 * Maps HTTP status codes and transport failures into deterministic error objects.
 */

export class DomainError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(message: string, code: string = 'DOMAIN_ERROR', status?: number, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class AuthenticationError extends DomainError {
  constructor(message: string = 'Invalid or missing API Access Key (X-API-Key)', details?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Access forbidden for current analyst privileges', details?: unknown) {
    super(message, 'FORBIDDEN_ERROR', 403, details);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = 'Requested forensic case or evidence was not found', details?: unknown) {
    super(message, 'NOT_FOUND_ERROR', 404, details);
  }
}

export class PayloadTooLargeError extends DomainError {
  constructor(message: string = 'Uploaded .EML file exceeds maximum size limit (25 MB)', details?: unknown) {
    super(message, 'PAYLOAD_TOO_LARGE', 413, details);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string = 'Validation failed for request parameters', details?: unknown) {
    super(message, 'VALIDATION_ERROR', 422, details);
  }
}

export class RateLimitError extends DomainError {
  public readonly retryAfterSeconds: number;

  constructor(message: string = 'Rate limit exceeded. Please wait before retrying.', retryAfterSeconds: number = 60, details?: unknown) {
    super(message, 'RATE_LIMIT_ERROR', 429, details);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class BackendExecutionError extends DomainError {
  constructor(message: string = 'Internal forensic engine failure during investigation', status: number = 500, details?: unknown) {
    super(message, 'BACKEND_EXECUTION_ERROR', status, details);
  }
}

export class NetworkError extends DomainError {
  constructor(message: string = 'Unable to reach backend forensic engine. Check network or server status.', details?: unknown) {
    super(message, 'NETWORK_ERROR', 0, details);
  }
}
