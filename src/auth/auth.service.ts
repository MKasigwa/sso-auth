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

  async register(
    email: string,
    password: string,
    displayName: string,
  ): Promise<User> {
    const hashedPassword: string = (await (
      hash as (data: any, salt: any, cb?: any) => any
    )(password, 10)) as string;
    const user: User = new User();
    user.email = email;
    user.password = hashedPassword;
    user.displayName = displayName;
    return this.userService.save(user);
  }

  async validateGoogleUser(email: string, displayName: string): Promise<User> {
    let user = await this.userService.findOne(email);

    if (!user) {
      const userToSave: User = new User();
      userToSave.email = email;
      userToSave.password = '';
      userToSave.displayName = displayName;
      user = await this.userService.save(userToSave);
    }
    return user;
  }
}
