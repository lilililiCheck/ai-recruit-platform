import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async findAll(query: any): Promise<{ jobs: Job[]; total: number }> {
    const { page = 1, limit = 20, keyword, location, category, salaryMin, salaryMax } = query;

    const qb = this.jobsRepository.createQueryBuilder('job')
      .where('job.isActive = :isActive', { isActive: true });

    if (keyword) {
      qb.andWhere('(job.title LIKE :keyword OR job.company LIKE :keyword OR job.description LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    if (location) {
      qb.andWhere('job.location LIKE :location', { location: `%${location}%` });
    }

    if (category) {
      qb.andWhere('job.category = :category', { category });
    }

    if (salaryMin) {
      qb.andWhere('job.salaryMax >= :salaryMin', { salaryMin: Number(salaryMin) });
    }

    if (salaryMax) {
      qb.andWhere('job.salaryMin <= :salaryMax', { salaryMax: Number(salaryMax) });
    }

    qb.orderBy('job.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [jobs, total] = await qb.getManyAndCount();

    return { jobs, total };
  }

  async findById(id: number): Promise<Job> {
    return this.jobsRepository.findOne({ where: { id } });
  }

  async search(keyword: string, limit = 20): Promise<Job[]> {
    return this.jobsRepository
      .createQueryBuilder('job')
      .where('job.isActive = :isActive', { isActive: true })
      .andWhere('(job.title LIKE :keyword OR job.company LIKE :keyword)', {
        keyword: `%${keyword}%`,
      })
      .orderBy('job.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async create(data: Partial<Job>): Promise<Job> {
    const job = this.jobsRepository.create(data);
    return this.jobsRepository.save(job);
  }

  async getCategories(): Promise<{ category: string; count: number }[]> {
    return this.jobsRepository
      .createQueryBuilder('job')
      .select('job.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('job.isActive = :isActive', { isActive: true })
      .groupBy('job.category')
      .getRawMany();
  }
}
