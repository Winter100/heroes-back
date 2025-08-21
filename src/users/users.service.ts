import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { PasswordHasher } from 'src/auth/utils/password.hasher';
import { SignUpDto } from '../auth/dto/signUp.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(signupDto: SignUpDto) {
    const { email, name, password } = signupDto;

    const user = await this.findUserByEmail(email);

    if (user) throw new BadRequestException();

    const hashedPassword = await PasswordHasher.hash(password);

    const createdUser = await this.userRepository.create(
      email,
      name,
      hashedPassword,
    );
    return createdUser;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email);
  }
}
