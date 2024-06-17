import { Injectable } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { ListDictData, ListDictType, UpdateDictDataDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SysDictDataEntity } from './entities/dict.data.entity';
import { In, Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { SysDictTypeEntity } from './entities/dict.type.entity';

@Injectable()
export class DictService {
  @InjectRepository(SysDictDataEntity)
  private readonly sysDictDataEntityRep: Repository<SysDictDataEntity>;
  @InjectRepository(SysDictTypeEntity)
  private readonly sysDictTypeEntityRep: Repository<SysDictTypeEntity>;
  create(createDictDto: CreateDictDto) {
    return 'This action adds a new dict';
  }

  async deleteType(dictIds: number[]){
    this.sysDictTypeEntityRep.update({
      dictId: In(dictIds)
    },{
      delFlag:'1'
    })
    return ResultData.ok();
  }
  async findAllType(query: ListDictType) {
    const entity = this.sysDictTypeEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.dictName) {
      entity.andWhere(`entity.dictLabel LIKE "%${query.dictName}%"`);
    }
    if (query.dictType) {
      entity.andWhere(`entity.dictType LIKE "%${query.dictType}%"`);
    }
    if (query.status) {
      entity.andWhere('entity.status = :status', { status: query.status });
    }
    entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await entity.getManyAndCount();
    return ResultData.ok({
      list,
      total,
    });
  }
  async findAllDate(query: ListDictData) {
    const entity = this.sysDictDataEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.dictLabel) {
      entity.andWhere(`entity.dictLabel LIKE "%${query.dictLabel}%"`);
    }
    if (query.dictType) {
      entity.andWhere(`entity.dictType LIKE "%${query.dictType}%"`);
    }
    if (query.status) {
      entity.andWhere('entity.status = :status', { status: query.status });
    }
    entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await entity.getManyAndCount();
    return ResultData.ok({
      list,
      total,
    });
  }
  async updateDictData(dictData: UpdateDictDataDto){
    this.sysDictDataEntityRep.update({
      dictCode: dictData.dictCode
    },dictData)
  }
  async createDictData(dictData: CreateDictDto) {
      await this.sysDictDataEntityRep.save(dictData);
      return ResultData.ok();
  }
  async findOneDictData(dictCode: number) {
    const data = await this.sysDictDataEntityRep.findOneBy({
      dictCode,
      delFlag: '0',
    });
    return ResultData.ok(data);
  }

  async deleteDictData(dictCode: number) {
    const data = await this.sysDictDataEntityRep.update(
      {
        dictCode,
      },
      {
        delFlag: '1',
      },
    );
    return ResultData.ok();
  }
  findAll() {
    return `This action returns all dict`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dict`;
  }

  update(id: number, updateDictDto: UpdateDictDto) {
    return `This action updates a #${id} dict`;
  }

  remove(id: number) {
    return `This action removes a #${id} dict`;
  }
}
