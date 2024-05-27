import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:[path.join(__dirname, 'config/.env')]
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService){
        return {
          secret: configService.get('jwt_secret'),
          // signOptions: {
          //   expiresIn: '1h'
          // }
        }
      },
      inject:[ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory(configService:ConfigService){
        return {
          type: "mysql",
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: false,
          logging: true,
          supportBigNumbers: true,
          bigNumberStrings: true,
          // entities: [City,User,Role,Permission,MeetingRoom,Booking],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
              authPlugin: 'sha256_password',
          }
        }
      }
    }),
    RedisModule,
    
  ],
  controllers: [AppController],
  providers: [AppService,
    {
    provide: APP_GUARD,
    useClass:AuthGuard
  }
],
})
export class AppModule {}
