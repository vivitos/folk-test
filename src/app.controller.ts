import { Controller, Get, Param } from '@nestjs/common';
import { Post } from 'types/global';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('post/:postID')
  getPostWithMentions(@Param('postID') postID): Post {
    return this.appService.getPostWithMentions(postID);
  }
}
