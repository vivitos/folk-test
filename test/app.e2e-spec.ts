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

  it('should return 404 when post id is not defined', () => {
    return request(app.getHttpServer())
      .get('/post/1234')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return mentions when post got at least one', async () => {
    const { body } = await request(app.getHttpServer()).get('/post/1');
    expect(body.mentions).toHaveLength(1);
  });

  it('should return post even without mentions', async () => {
    const { body } = await request(app.getHttpServer()).get('/post/3');
    expect(body.mentions).not.toBeDefined();
    expect(body.text).toBeDefined();
  });
});
