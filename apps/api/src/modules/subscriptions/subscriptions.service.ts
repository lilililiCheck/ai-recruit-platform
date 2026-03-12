import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async findAll(userId: number): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, data: Partial<Subscription>): Promise<Subscription> {
    const subscription = this.subscriptionsRepository.create({
      ...data,
      userId,
    });
    return this.subscriptionsRepository.save(subscription);
  }

  async update(userId: number, id: number, data: Partial<Subscription>): Promise<Subscription> {
    await this.subscriptionsRepository.update({ id, userId }, data);
    const subscription = await this.subscriptionsRepository.findOne({ where: { id } });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  async remove(userId: number, id: number): Promise<void> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id, userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await this.subscriptionsRepository.remove(subscription);
  }

  async findActiveByFrequency(frequency: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });
  }
}
