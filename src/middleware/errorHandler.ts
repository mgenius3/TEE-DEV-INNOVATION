import { Request, Response, NextFunction } from 'express';

// 404 handler (no route matched)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Resource not found'
  });
};



export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  // MySQL duplicate entry error
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      error: 'Email already exists'
    }); 
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error'
  });
};