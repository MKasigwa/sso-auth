import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async find(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async save(user: User): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = user;
    const userToSave = this.userRepository.create(rest);
    return this.userRepository.save(userToSave);
  }
}
