import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt'


@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }
  async create(createUserInput: CreateUserInput) {
    // Not  :Make  sure to not save thr password in plan text. usea hashing alogrithm like bcrypt to hash the password
    return this.usersRepository.create({ ...createUserInput, password: await this.hashPassword(createUserInput.password) });
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id })
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(updateUserInput.password);
    }
    return this.usersRepository.findOneAndUpdate({ _id }, {
      $set: {
        ...updateUserInput,
      }
    })
  }

  async remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
  
    //user not found scenario is handled in the abstract repository
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Cridentials')
    }
  
    return user;
  }
}


