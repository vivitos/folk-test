import { Injectable } from '@nestjs/common';
import * as Users from '../../db/users.json';
import * as Posts from '../../db/posts.json';
import { UserDAO, PostDAO } from 'types/global';

@Injectable()
export class DatabaseService {
  /**
   * @param id
   * @returns UserDAO
   * Find a user with his ID in DB
   */
  findUserByID(id: number): UserDAO {
    return Users.find((user) => user.id === id);
  }

  /**
   * @param id
   * @returns PostDAO
   * Find a post with his ID in DB
   */
  findPostByID(id: number): PostDAO {
    return Posts.find((user) => user.id === id);
  }

  /**
   * @param id
   * @returns UserDAO[]
   * Find a users with their IDs in DB
   */
  findManyUsersByID(ids: number[]): UserDAO[] {
    return Users.filter((user) => ids.includes(user.id));
  }
}
