import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { whitelist } from '../constant';
import { Reflector } from '@nestjs/core';
import { pathToRegexp } from 'path-to-regexp';
import { JwtService } from '@nestjs/jwt';
import { ALLOW_ANON } from '../decorators/allow-anon.decorator';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private globalWhiteList: typeof whitelist;
  @Inject(Reflector)
  private readonly reflector: Reflector;
  @Inject(JwtService)
  private readonly jwtService:JwtService;
  constructor() {
    super();
    this.globalWhiteList = [].concat(whitelist);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isInWhitelist = this.checkWhiteList(context);
    if(isInWhitelist) return true;
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [context.getHandler(),context.getClass()]);
    if(allowAnon) return true;
    const req  = context.switchToHttp().getRequest();
    const authorization = req.get('Authorization');
    if (!authorization) throw new UnauthorizedException('用户未登录');

     try {
      const token =  authorization.split(' ')[1];
      const data =  this.jwtService.verify(token);
      req.user =  {...data};
      return true;
     }catch (e) {
      throw new UnauthorizedException('token失效，请重新登录')
     }
  }
  /**
   * 检查接口是否在白名单内
   * @param ctx
   * @returns
   */
  checkWhiteList(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const i = this.globalWhiteList.findIndex((route) => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        return !!pathToRegexp(route.path).exec(req.url);
      }
      return false;
    });
    // 在白名单内 则 进行下一步， i === -1 ，则不在白名单，需要 比对是否有当前接口权限
    return i > -1;
  }
}
