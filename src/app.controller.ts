import { Controller, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthRegister } from './dto/authRegister.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  registerUser(@Body() body: AuthRegister, @Res() res: Response) {
    return this.appService.registerUser(body, res);
  }
}
