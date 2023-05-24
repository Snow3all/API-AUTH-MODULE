import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { hash } from 'bcrypt';
import { AuthRegister } from './dto/authRegister.dto';
import { User, UsersDocument } from './schema/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>,
  ) {}
  async registerUser(body: AuthRegister, res: Response) {
    try {
      const { username, password, confirmPassword } = body.data;
      if (username) {
        if (password.localeCompare(confirmPassword) === 0) {
          //Coding Here
          const user = new this.userModel({
            username: username.toLowerCase().trim(),
            password: await hash(password, parseInt(process.env.SALTROUNDS)),
          });
          const _user = await user.save();
          return res.status(200).json({
            statusCode: 0,
            message: 'Done Registering',
            data: _user,
          });
        } else {
          return res.status(200).json({
            statusCode: 112,
            message: 'Passwords do not match',
          });
        }
      }
    } catch (e) {
      return res.status(200).json({
        statusCode: 999,
        message: e,
      });
    }
  }
}
