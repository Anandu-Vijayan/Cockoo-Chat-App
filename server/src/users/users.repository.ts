import { Injectable, Logger } from "@nestjs/common";
import { AbstractRespository } from "src/common/database/abstract.repository";
import { User } from "./entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRespository<User> {
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(@InjectModel(User.name) userModel:
        Model<User>) {
        super(userModel);
    }

}