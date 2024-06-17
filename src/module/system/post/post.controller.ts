import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostDto } from './dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('system/post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @ApiOperation({
    summary: '岗位管理-列表',
  })
  @ApiBody({
    type: ListPostDto,
    required: true,
  })
  @Get('/list')
  findAll(@Query() query: ListPostDto) {
    return this.postService.findAll(query);
  }
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  // @Get()
  // findAll() {
  //   return this.postService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
