import { Controller, All, Req, Res, Inject } from '@nestjs/common';
import type { Request, Response } from 'express';
import { BETTER_AUTH } from './auth.constants';
import type { Auth } from './auth.config';
import { toNodeHandler } from 'better-auth/node';
import { Public } from '../common/decorators/public.decorator';
@Controller('auth')
@Public()
export class AuthController {
  constructor(@Inject(BETTER_AUTH) private readonly auth: Auth) {}

  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.auth)(req, res);
  }
}