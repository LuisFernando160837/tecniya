import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EncryptionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send.bind(res);
    res.send = function (body: any) {
      return originalSend(body);
    };
    next();
  }
}
