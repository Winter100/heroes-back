import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
// @Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: HttpStatus;
    // let errorMessage: string;
    console.log('exception', exception);

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        console.log('202', exception?.meta?.target);
        break;
      }
      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        console.log('default', exception?.meta?.target);
        break;
      }
    }

    response.status(status).json(exception);
  }
}
