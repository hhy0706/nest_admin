import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SysPostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { ListPostDto } from './dto';
import { ResultData } from 'src/common/utils/result';

@Injectable()
export class PostService {
  @InjectRepository(SysPostEntity)
  private readonly sysPostEntity: Repository<SysPostEntity>;
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

 async findAll(query:ListPostDto) {
    const entity = this.sysPostEntity.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.postName) {
      entity.andWhere(`entity.dictLabel LIKE "%${query.postName}%"`);
    }
    if (query.postCode) {
      entity.andWhere(`entity.dictType LIKE "%${query.postCode}%"`);
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

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
