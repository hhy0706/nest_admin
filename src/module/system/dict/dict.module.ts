import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDictDataEntity } from './entities/dict.data.entity';
import { SysDictTypeEntity } from './entities/dict.type.entity';
@Module({
  imports: [TypeOrmModule.forFeature([SysDictDataEntity,SysDictTypeEntity])],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
