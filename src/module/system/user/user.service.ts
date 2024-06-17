import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/sys-user.entity';
import { Repository } from 'typeorm';
import { ClientInfoDto, LoginDto, RegisterDto } from '../../main/dto';
import { ResultData } from 'src/common/utils/result';
import { JwtService } from '@nestjs/jwt';
import { GenerateUUID, generateCaptcha,hashPassword,verifyPassword } from 'src/common/utils';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>;
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  async register(user: RegisterDto){
    const data = await this.userRepo.findOneBy({
      userName: user.username
    })
    if(data){
      return ResultData.fail(500,'账号重复')
    }
    const hashPs = await hashPassword(user.password);
    await this.userRepo.insert({nickName:user.username,userName:user.username,password:hashPs});
    return ResultData.ok(200,'注册成功');
  }
  async login(user: LoginDto, clientInfo: ClientInfoDto) {
    
    const data = await this.userRepo.findOne({
      where: {
        userName: user.username,
      },
    });
    if (!data) {
      return ResultData.fail(500, '账号不存在');
    }
    const isMatch = await verifyPassword(user.password,data.password)
    if (!isMatch) {
      return ResultData.fail(500, '密码错误');
    }
    const uuid = GenerateUUID();
    const token = this.createToken({ uuid, userId: user.username });
    return ResultData.ok(
      {
        token,
      },
      '登录成功',
    );
  }
  /**
   * 从数据声明生成令牌
   *
   * @param payload 数据声明
   * @return 令牌
   */
  createToken(payload: { uuid: string; userId: number | string }): string {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
