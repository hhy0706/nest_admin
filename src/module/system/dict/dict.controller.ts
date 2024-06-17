import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDictDataDto, ListDictData, ListDictType, UpdateDictDataDto } from './dto';
import { get } from 'http';

@Controller('system/dict')
@ApiTags('字典')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post()
  create(@Body() createDictDto: CreateDictDto) {
    return this.dictService.create(createDictDto);
  }
  // @ApiOperation({
  //   summary: '字典数据-列表',
  // })
  // @Get('/data/list')
  // findAllData(@Query() query: ListDictData) {
  //   return this.dictService.findAllData(query);
  // }
  @ApiOperation({
    summary: '字典类型-删除',
  })
  @Delete('/type/:id')
  deleteType(@Param('id') ids: string){
    const dictIds = ids.split(',').map((id) => +id);
    return this.dictService.deleteType(dictIds);
  }

  @ApiOperation({
    summary: '字典类型-列表',
  })
  @Get('/type/list')
  findAllType(@Query() query: ListDictType) {
    return this.dictService.findAllType(query);
  }
  @Post('data')
  @ApiOperation({
    summary:'字典数据-创建'
  })
  createDictData(@Body() createDictData:CreateDictDataDto){
    return this.dictService.createDictData(createDictData);
  }

  @Put('data')
  @ApiOperation({
    summary:'字典数据-创建'
  })
  updateDictData(@Body() updateDictData:UpdateDictDataDto){
    return this.dictService.updateDictData(updateDictData);
  }
  @Get('data/list')
  @ApiOperation({
    summary:'字典数据-列表'
  })
 async findAllDate(@Query() query: ListDictData) {
    return this.dictService.findAllDate(query);
  }
  @Get('data/:id')
  @ApiOperation({
    summary:'字典数据-详情'
  })
  fineOneDictData(@Param('id',ParseIntPipe) dictCode: number){
    return this.dictService.findOneDictData(dictCode); 
  }
  @Post('data/:id')
  @ApiOperation({
    summary:'字典数据-删除'
  })
  deleteDictData(@Param('id',ParseIntPipe) id: number){
    return this.dictService.deleteDictData(id)
  }


  
  @Get()
  findAll() {
    return this.dictService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictDto: UpdateDictDto) {
    return this.dictService.update(+id, updateDictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictService.remove(+id);
  }
}
