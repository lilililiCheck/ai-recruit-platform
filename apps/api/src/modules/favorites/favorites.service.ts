import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async findAll(userId: number): Promise<Favorite[]> {
    return this.favoritesRepository.find({
      where: { userId },
      relations: ['job'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, jobId: number): Promise<Favorite> {
    const existing = await this.favoritesRepository.findOne({
      where: { userId, jobId },
    });

    if (existing) {
      return existing;
    }

    const favorite = this.favoritesRepository.create({ userId, jobId });
    return this.favoritesRepository.save(favorite);
  }

  async remove(userId: number, id: number): Promise<void> {
    const favorite = await this.favoritesRepository.findOne({
      where: { id, userId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoritesRepository.remove(favorite);
  }

  async checkIsFavorite(userId: number, jobId: number): Promise<boolean> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, jobId },
    });
    return !!favorite;
  }
}
