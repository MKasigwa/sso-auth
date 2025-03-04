import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<string | null> {
    const user = await this.userService.findOne(email);
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
    const user: User = new User();
    user.email = email;
    user.password = hashedPassword;
    return this.userService.save(user);
  }
}
