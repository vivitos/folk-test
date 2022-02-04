import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Get post with mentions', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return 200 when post is defined', () => {
    return request(app.getHttpServer()).get('/post/1').expect(HttpStatus.OK);
  });

  it('should return 400 when post id is not a number', () => {
    return request(app.getHttpServer())
      .get('/post/test')
      .expect(HttpStatus.BAD_REQUEST);
  });
});
