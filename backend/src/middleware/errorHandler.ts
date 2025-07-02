import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err)

  // Default error
  let error = {
    message: err.message || 'Internal server error',
    status: err.status || 500,
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map((val: any) => val.message).join(', ')
    error.status = 400
  }

  // Duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered'
    error.status = 400
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token'
    error.status = 401
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired'
    error.status = 401
  }

  res.status(error.status).json({
    success: false,
    error: error.message,
  })
}
