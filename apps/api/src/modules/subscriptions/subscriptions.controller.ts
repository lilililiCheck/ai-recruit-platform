import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.subscriptionsService.findAll(req.user.id);
  }

  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.subscriptionsService.create(req.user.id, body);
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: number, @Body() body: any) {
    return this.subscriptionsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    return this.subscriptionsService.remove(req.user.id, id);
  }
}
