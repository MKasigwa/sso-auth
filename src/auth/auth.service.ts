import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (
      user &&
      (await (compareSync as (data: any, hash: any) => any)(
        password,
        user.password,
      ))
    ) {
      return this.jwtService.sign({ email, sub: user.id });
    }

    return null;
  }

  async register(email: string, password: string): Promise<User> {
    const hashedPassword: string = (await (
      hash as (data: any, salt: any, cb?: any) => any
    )(password, 10)) as string;
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }
}
