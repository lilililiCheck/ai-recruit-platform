import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.id);
  }

  @Post()
  async create(@Request() req, @Body() body: { jobId: number }) {
    return this.favoritesService.create(req.user.id, body.jobId);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    return this.favoritesService.remove(req.user.id, id);
  }

  @Get('check/:jobId')
  async check(@Request() req, @Param('jobId') jobId: number) {
    const isFavorite = await this.favoritesService.checkIsFavorite(req.user.id, jobId);
    return { isFavorite };
  }
}
