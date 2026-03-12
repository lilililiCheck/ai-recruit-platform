import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  @Get('search')
  async search(@Query('keyword') keyword: string, @Query('limit') limit?: number) {
    return this.jobsService.search(keyword, limit);
  }

  @Get('categories')
  async getCategories() {
    return this.jobsService.getCategories();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.jobsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }
}
