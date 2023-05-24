import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { hash, compare } from 'bcrypt';
import { AuthRegister } from './dto/authRegister.dto';
import { AuthLogin } from './dto/authLogin.dto';
import { User, UsersDocument } from './schema/user.schema';
import { OrderHistory, OrderHistoryDocument } from './schema/order.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>,
    @InjectModel(OrderHistory.name)
    private readonly orderHistoryModel: Model<OrderHistoryDocument>,
    private jwtService: JwtService,
  ) {}
  async registerUser(body: AuthRegister, res: Response) {
    try {
      const { username, password, confirmPassword, name, email } = body.data;
      if (username) {
        if (password.localeCompare(confirmPassword) === 0) {
          const user = new this.userModel({
            username: username.toLowerCase().trim(),
            password: await hash(password, 10),
            name: name,
            email: email,
          });
          const _user = await user.save();
          const history = await new this.orderHistoryModel({
            customer: _user.username,
            customerId: new Types.ObjectId(_user._id),
          }).save();
          await this.userModel.findOneAndUpdate(
            { _id: _user._id },
            { orderRef: history._id },
          );
          return res.status(200).json({
            statusCode: 0,
            message: 'Done Registering',
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

  async loginUser(body: AuthLogin, res: Response) {
    try {
      const { username, password } = body.data;
      const getUser = await await this.userModel.findOne({
        username: username.toLowerCase(),
      });
      const comparesPassword = await compare(password, getUser.password);
      if (comparesPassword) {
        const token = this.jwtService.sign({
          _id: getUser._id,
          username: getUser.username,
          name: getUser.name,
          email: getUser.email,
        });
        return res.status(200).json({
          statusCode: 0,
          token: token,
          message: 'Success',
        });
      } else {
        return res.status(200).json({
          statusCode: 113,
          message: 'Password does not match',
        });
      }
    } catch (e) {
      return res.status(200).json({
        statusCode: 999,
        message: e,
      });
    }
  }
}
