import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { RevalidateService } from './revalidate.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('revalidate')
export class RevalidateController {
  constructor(private readonly revalidateService: RevalidateService) {}

  @Post(`:path`)
  revalidatePath(@Param() path: string) {
    return this.revalidateService.revalidatePath(path);
  }
}
