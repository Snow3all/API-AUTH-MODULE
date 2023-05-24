import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { hash } from 'bcrypt';
import { AuthRegister } from './dto/authRegister.dto';
import { User, UsersDocument } from './schema/user.schema';
import { OrderHistory, OrderHistoryDocument } from './schema/order.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>,
    @InjectModel(OrderHistory.name)
    private readonly orderHistoryModel: Model<OrderHistoryDocument>,
  ) {}
  async registerUser(body: AuthRegister, res: Response) {
    try {
      const { username, password, confirmPassword, name, email } = body.data;
      if (username) {
        if (password.localeCompare(confirmPassword) === 0) {
          //Coding Here
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
}
