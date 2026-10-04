import { Controller, Post, UseGuards, Body } from '@nestjs/common';
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

  @Post()
  revalidatePath(@Body() body: { tag: string; id?: string }) {
    return this.revalidateService.revalidatePath(body.tag, body?.id);
  }
}
