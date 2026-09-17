import { BadRequestException, Param, ParseIntPipe } from '@nestjs/common';

export function IntParam(property: string, errorMessage: string) {
  return Param(
    property,
    new ParseIntPipe({
      exceptionFactory: () => new BadRequestException(errorMessage),
    }),
  );
}
