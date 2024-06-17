import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";


export class LoginDto {
  
    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsString()
    uuid: string;

    @ApiProperty()
    @IsString()
    @Length(2,10)
    username: string;

    @ApiProperty()
    @IsString()
    @Length(5,20)
    password: string;
}
export class RegisterDto extends LoginDto {}
export class ClientInfoDto {
    ipaddr: string;
    userAgent: string;
    browser: string;
    os: string;
    loginLocation: string;
  }