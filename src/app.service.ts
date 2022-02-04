import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Post } from 'types/global';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {}

  private readonly logger = new Logger(AppService.name);

  // Regular expressions to match and extract mentions from post
  private static readonly REGEX_MATCH = /<@(.*?)>/g;
  private static readonly REGEX_EXTRACT = /<@|>/g;

  // Extract user id from post text
  private getMentionsFromPost(text: string): number[] | null {
    // First we get all mentions
    const extractedMentions = text.match(AppService.REGEX_MATCH);

    if (!extractedMentions) return null;

    // Then, we extract only mentions that can be parsed as integer
    const mentionnedUserIDs = extractedMentions.reduce((acc, extract) => {
      const userID = parseInt(extract.replace(AppService.REGEX_EXTRACT, ''));

      return isNaN(userID) ? acc : acc.concat([userID]);
    }, []);

    return mentionnedUserIDs;
  }

  // Return a post with mentions
  getPostWithMentions(postID): Post {
    this.logger.log('Starting getPostWithMentions');

    if (isNaN(parseInt(postID))) {
      this.logger.error('PostID should be a number');
      throw new HttpException(
        'PostID should be a number',
        HttpStatus.BAD_REQUEST,
      );
    }

    // We are looking for a post
    const post = this.db.findPostByID(parseInt(postID));

    if (!post) {
      this.logger.error('Post not found');
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    // Then we search his author
    const author = this.db.findUserByID(post.authorID);

    if (!author) {
      this.logger.error('Author not found');
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }

    // We extract mentions
    const rawMentions = this.getMentionsFromPost(post.text);

    // If there are no mentions we can send it back to user
    if (!rawMentions?.length) {
      this.logger.log('Return getPostWithMentions');
      return {
        id: post.id,
        author,
        text: post.text,
      };
    }

    // We are looking for users mentionned in DB
    const mentions = this.db.findManyUsersByID(rawMentions);

    this.logger.log('Return getPostWithMentions');
    return {
      id: post.id,
      author,
      text: post.text,
      mentions,
    };
  }
}
