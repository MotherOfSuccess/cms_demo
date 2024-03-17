import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

describe('UserController', () => {
  let controller: UserController;
  const username = 'khoa123';
  const password = 'khoa';
  const permission = [{ code: 'QLTT' }];

  const mockUserService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(
      controller.addUser(
        {
          username: username,
          password: password,
          permission: permission,
          status: true,
        },
        null,
      ),
    ).toBeDefined();
  });
});
