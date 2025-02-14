import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('📌 Incoming Request:');
    console.log(`🔹 Method: ${req.method}`);
    console.log(`🔹 URL: ${req.originalUrl}`);
    console.log(`🔹 Headers:`, req.headers);
    console.log(`🔹 Query Params:`, req.query);
    console.log(`🔹 Body:`, req.body);
    
    next();
  }
}
