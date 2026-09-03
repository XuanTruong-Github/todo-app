import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BETTER_AUTH } from './auth.constants';
import type { Auth } from './auth.config';
import { fromNodeHeaders } from 'better-auth/node';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(BETTER_AUTH) private readonly auth: Auth,
    private readonly reflector: Reflector, // 👈 Inject Reflector của NestJS
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Kiểm tra xem route hoặc controller có gắn @Public() không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Bỏ qua xác thực
    }

    // 2. Nếu không có @Public() -> Bắt buộc kiểm tra session
    const request = context.switchToHttp().getRequest();
    const session = await this.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedException('Chưa đăng nhập hoặc session đã hết hạn');
    }

    request.user = session.user;
    request.session = session.session;

    return true;
  }
}
