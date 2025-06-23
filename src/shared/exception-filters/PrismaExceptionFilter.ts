import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Catch, HttpStatus } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import type { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  cause?: string;
  details?: unknown;
}

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
)
export class PrismaExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const context: HttpArgumentsHost = host.switchToHttp();
    const response: Response = context.getResponse<Response>();

    const errorResponse: ErrorResponse = this.handleError(exception);
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private handleError(error: unknown): ErrorResponse {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handleKnownRequestError(error);
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return this.handleValidationError(error);
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return this.handleInitializationError(error);
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      return this.handleRustPanicError(error);
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return this.handleUnknownRequestError(error);
    }

    return this.handleUnexpectedError();
  }

  private handleKnownRequestError(
    error: Prisma.PrismaClientKnownRequestError,
  ): ErrorResponse {
    const cause: string = (error.meta?.cause ?? error.message) as string;

    // Connection and authentication errors (P1xxx)
    if (error.code.startsWith('P1')) {
      return this.handleConnectionError(error, cause);
    }

    // Query and data errors (P2xxx)
    switch (error.code) {
      // Not Found errors
      case 'P2001':
      case 'P2015':
      case 'P2018':
      case 'P2021': // Table not found
      case 'P2022': // Column not found
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.getNotFoundMessage(error.code),
          cause,
          details: error.meta,
        };

      // Validation & Constraint errors
      case 'P2000': // Value too long
      case 'P2006': // Invalid value for field
      case 'P2007': // Data validation error
      case 'P2011': // Null constraint violation
      case 'P2012': // Missing required value
      case 'P2019': // Input error
      case 'P2020': // Value out of range
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.getValidationMessage(error.code),
          cause,
          details: error.meta,
        };

      // Conflict errors
      case 'P2002': // Unique constraint
      case 'P2003': // Foreign key constraint
      case 'P2004': // Constraint violation
      case 'P2014': // Required relation violation
        return {
          statusCode: HttpStatus.CONFLICT,
          message: this.getConflictMessage(error.code),
          cause,
          details: error.meta,
        };

      // Query execution errors
      case 'P2008': // Query parse error
      case 'P2009': // Query validation error
      case 'P2010': // Raw query error
      case 'P2016': // Query interpretation error
      case 'P2029': // Query parameter limit
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.getQueryErrorMessage(error.code),
          cause,
          details: error.meta,
        };

      // Transaction errors
      case 'P2028': // Transaction API error
      case 'P2034': // Transaction conflict/deadlock
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Transaction error occurred',
          cause,
          details: error.meta,
        };

      // Resource limit errors
      case 'P2024': // Connection pool timeout
      case 'P2037': // Too many connections
        return {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Database resource limit reached',
          cause,
          details: error.meta,
        };

      // Feature support errors
      case 'P2026': // Unsupported feature
      case 'P2030': // Missing fulltext index
      case 'P2031': // MongoDB replica set required
        return {
          statusCode: HttpStatus.NOT_IMPLEMENTED,
          message: 'Database feature not supported',
          cause,
          details: error.meta,
        };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error occurred',
          cause,
          details: error.meta,
        };
    }
  }

  private handleConnectionError(
    error: Prisma.PrismaClientKnownRequestError,
    cause: string,
  ): ErrorResponse {
    switch (error.code) {
      case 'P1000': // Auth failed
      case 'P1010': // Access denied
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Database authentication failed',
          cause,
        };

      case 'P1001': // Cannot reach database
      case 'P1002': // Connection timeout
        return {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Database connection failed',
          cause,
        };

      case 'P1008': // Operation timeout
      case 'P1011': // TLS connection error
        return {
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'Database operation timed out',
          cause,
        };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database connection error',
          cause,
        };
    }
  }

  private handleValidationError(
    error: Prisma.PrismaClientValidationError,
  ): ErrorResponse {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid query or data validation failed',
      cause: error.message,
    };
  }

  private handleInitializationError(
    error: Prisma.PrismaClientInitializationError,
  ): ErrorResponse {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database initialization failed',
      cause: error.message,
      details: { errorCode: error.errorCode },
    };
  }

  private handleRustPanicError(
    error: Prisma.PrismaClientRustPanicError,
  ): ErrorResponse {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Critical database error occurred',
      cause: error.message,
    };
  }

  private handleUnknownRequestError(
    error: Prisma.PrismaClientUnknownRequestError,
  ): ErrorResponse {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unknown database error occurred',
      cause: error.message,
    };
  }

  private handleUnexpectedError(): ErrorResponse {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected error occurred',
    };
  }

  private getNotFoundMessage(code: string): string {
    switch (code) {
      case 'P2001':
        return 'Record not found';
      case 'P2015':
      case 'P2018':
        return 'Related record not found';
      case 'P2021':
        return 'Table not found';
      case 'P2022':
        return 'Column not found';
      case 'P2025':
        return 'Required resource not found';
      default:
        return 'Resource not found';
    }
  }

  private getValidationMessage(code: string): string {
    switch (code) {
      case 'P2000':
        return 'Field value too long';
      case 'P2006':
        return 'Invalid field value';
      case 'P2007':
        return 'Data validation failed';
      case 'P2011':
        return 'Required field cannot be null';
      case 'P2012':
        return 'Required field missing';
      case 'P2019':
        return 'Input validation failed';
      case 'P2020':
        return 'Value out of range';
      default:
        return 'Validation error';
    }
  }

  private getConflictMessage(code: string): string {
    switch (code) {
      case 'P2002':
        return 'Unique constraint violation';
      case 'P2003':
        return 'Foreign key constraint violation';
      case 'P2004':
        return 'Database constraint violation';
      case 'P2014':
        return 'Required relation violation';
      default:
        return 'Resource conflict';
    }
  }

  private getQueryErrorMessage(code: string): string {
    switch (code) {
      case 'P2008':
        return 'Query parse error';
      case 'P2009':
        return 'Query validation error';
      case 'P2010':
        return 'Raw query error';
      case 'P2016':
        return 'Query interpretation error';
      case 'P2029':
        return 'Query parameter limit exceeded';
      default:
        return 'Query error';
    }
  }
}
