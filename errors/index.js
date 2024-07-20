class CustomError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message)
    this.statusCode = 401
  }
}

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message)
    this.statusCode = 403
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message)
    this.statusCode = 404
  }
}

class ValidationError extends CustomError {
  constructor(message, errors) {
    super(message)
    this.statusCode = 422
    this.errors = errors
  }
}

export default {
  CustomError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
}