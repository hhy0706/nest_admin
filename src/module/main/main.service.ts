import { Inject, Injectable } from '@nestjs/common';
import { ClientInfoDto, LoginDto, RegisterDto } from './dto';
import { RedisService } from 'src/redis/redis.service';
import { ResultData } from 'src/common/utils/result';
import { UserService } from '../system/user/user.service';


@Injectable()
export class MainService {
    @Inject(UserService)
    userService:UserService
    @Inject(RedisService)
  redisService: RedisService;
  async login(user: LoginDto, clientInfo: ClientInfoDto){
    const loginLog = {
        ...clientInfo,
        userName: user.username,
        status: '0',
        msg: '',
      }
      const loginRes = await this.userService.login(user,loginLog);
      return loginRes;
  }
  async register(user: RegisterDto){
      return this.userService.register(user);
  }
  async captcha(user: LoginDto){
    const captcha = await this.redisService.hGet('captchaImage',user.uuid);
    if(!captcha){
      return ResultData.fail(500, "验证码失效")
    }
    console.log(111111,captcha);
    if(captcha != user.code){
      return ResultData.fail(500,"验证码不正确")
    }
    
  }
}
