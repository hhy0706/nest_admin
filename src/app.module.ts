import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import {  JwtAuthGuard } from './common/guards/auth.guard';
import { MainModule } from './module/main/main.module';
import { DictModule } from './module/system/dict/dict.module';
import { UserModule } from './module/system/user/user.module';
import { PostModule } from './module/system/post/post.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.join(__dirname, 'config/.env')],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          // signOptions: {
          //   expiresIn: '1h'
          // }
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          autoLoadEntities: true,
          timezone: '+08:00',
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: false,
          logging: true,
          logger: 'file',
          supportBigNumbers: true,
          bigNumberStrings: true,
          // entities: [City,User,Role,Permission,MeetingRoom,Booking],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
    }),
    RedisModule,
    MainModule,
    UserModule,
    DictModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
