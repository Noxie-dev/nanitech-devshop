// supabase/functions/shared/errors.ts

export class ApplicationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public cause?: string
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class UserError extends ApplicationError {
  constructor(message: string, cause?: string) {
    super(message, 400, cause);
    this.name = 'UserError';
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'authentication_error');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'authorization_error');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'not_found');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends UserError {
  constructor(message: string, field?: string) {
    super(message, field ? `validation_error_${field}` : 'validation_error');
    this.name = 'ValidationError';
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'conflict');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApplicationError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'rate_limit');
    this.name = 'RateLimitError';
  }
}

export class ServerError extends ApplicationError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'server_error');
    this.name = 'ServerError';
  }
}

// Helper function to create standardized error responses
export function createErrorResponse(error: Error, requestId?: string) {
  const statusCode = error instanceof ApplicationError ? error.statusCode : 500;
  const cause = error instanceof ApplicationError ? error.cause : 'unknown_error';
  
  return {
    error: {
      message: error.message,
      code: cause,
      statusCode,
      requestId,
      timestamp: new Date().toISOString()
    }
  };
}

// Helper function to handle and format errors
export function handleError(error: unknown, requestId?: string) {
  console.error('Error occurred:', error);
  
  if (error instanceof ApplicationError) {
    return createErrorResponse(error, requestId);
  }
  
  // Handle unknown errors
  const unknownError = new ServerError('An unexpected error occurred');
  return createErrorResponse(unknownError, requestId);
}

