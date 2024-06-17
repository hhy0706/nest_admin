import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Inject,
} from '@nestjs/common';
import { MainService } from './main.service';
import { LoginDto, RegisterDto } from './dto/index';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as Useragent from 'useragent';
import { generateCaptcha } from 'src/common/utils';
import { ResultData } from 'src/common/utils/result';
import { RedisService } from 'src/redis/redis.service';
@ApiTags('根目录')
@Controller('/')
export class MainController {
  @Inject(RedisService)
  redisService: RedisService;
  constructor(private readonly mainService: MainService) {}

  @Get('captchaImage')
  @ApiOperation({
    summary: '获取验证码',
  })
  async captchaImage() {
    const { uuid, data, text } = generateCaptcha();
    await this.redisService.hSet('captchaImage', uuid, text, 3 * 60);
    return ResultData.ok({
      uuid,
      data,
    });
  }

  @Post('login')
  @ApiOperation({
    summary: '用户登陆',
  })
  @ApiBody({
    type: LoginDto,
    required: true,
  })
 async login(@Body() user: LoginDto, @Request() req) {
    const  captchaError = await this.mainService.captcha(user);
    if(captchaError){
      return captchaError;
    }
    const agent = Useragent.parse(req.header['user-agent']);

    const os = agent.os.toJSON().family;
    const browser = agent.toAgent();

    const clientInfo = {
      userAgent: req.headers['user-agent'],
      ipaddr: req.ip,
      browser: browser,
      os: os,
      loginLocation: '',
    };
    return this.mainService.login(user, clientInfo);
    // return this.mainService.create(createMainDto);
  }

  @Post('register')
  @ApiOperation({
    summary: '用户注册',
  })
  // @ApiBody({
  //   type: RegisterDto,
  //   required: true,
  // })
  async register(@Body() user:RegisterDto){
    const  captchaError = await this.mainService.captcha(user);
    if(captchaError){
      return captchaError;
    }
    return this.mainService.register(user);
  }
}
